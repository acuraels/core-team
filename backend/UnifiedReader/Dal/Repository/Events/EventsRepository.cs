using System.Data;
using Dal.Models.Events;
using Dal.Models.Events.interfaces;
using Dapper;

namespace Dal.Repository.Events;

public sealed class EventsRepository : IEventsRepository
{
    private readonly IDbConnection _connection;

    public EventsRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<IReadOnlyCollection<EventWithStats>> GetAllWithStatsAsync(CancellationToken cancellationToken)
    {
        const string sql = @"
SELECT 
    e.id,
    e.name,
    e.description,
    e.start_at AS StartAt,
    e.end_at AS EndAt,
    e.event_image AS EventImage,
    COUNT(er.*) AS RegistrationsCount,
    COALESCE(SUM(CASE WHEN er.is_visited THEN 1 ELSE 0 END), 0) AS VisitorsCount
FROM events e
LEFT JOIN event_regs er ON er.event_id = e.id
GROUP BY e.id, e.name, e.description, e.start_at, e.end_at, e.event_image
ORDER BY e.start_at;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        var result = await _connection.QueryAsync<EventWithStats>(
            new CommandDefinition(
                sql,
                cancellationToken: cancellationToken));

        return result.ToArray();
    }

    public async Task<EventWithStats?> GetByIdWithStatsAsync(long id, CancellationToken cancellationToken)
    {
        const string sql = @"
SELECT 
    e.id,
    e.name,
    e.description,
    e.start_at AS StartAt,
    e.end_at AS EndAt,
    e.event_image AS EventImage,
    COUNT(er.*) AS RegistrationsCount,
    COALESCE(SUM(CASE WHEN er.is_visited THEN 1 ELSE 0 END), 0) AS VisitorsCount
FROM events e
LEFT JOIN event_regs er ON er.event_id = e.id
WHERE e.id = @Id
GROUP BY e.id, e.name, e.description, e.start_at, e.end_at, e.event_image;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        var result = await _connection.QuerySingleOrDefaultAsync<EventWithStats>(
            new CommandDefinition(
                sql,
                new { Id = id },
                cancellationToken: cancellationToken));

        return result;
    }

    public async Task<bool> ExistsAsync(long id, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT 1 FROM events WHERE id = @Id;";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        var result = await _connection.ExecuteScalarAsync<int?>(
            new CommandDefinition(
                sql,
                new { Id = id },
                cancellationToken: cancellationToken));

        return result.HasValue;
    }

    public async Task RegisterAsync(long eventId, Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"
INSERT INTO event_regs (event_id, user_id, reg_datetime, is_visited)
VALUES (@EventId, @UserId, now(), false)
ON CONFLICT (event_id, user_id) DO NOTHING;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        await _connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                new
                {
                    EventId = eventId,
                    UserId = userId
                },
                cancellationToken: cancellationToken));
    }

    public async Task MarkVisitedAsync(long eventId, Guid userId, CancellationToken cancellationToken)
    {
        const string sql = @"
INSERT INTO event_regs (event_id, user_id, reg_datetime, is_visited)
VALUES (@EventId, @UserId, now(), true)
ON CONFLICT (event_id, user_id)
    DO UPDATE SET is_visited = EXCLUDED.is_visited;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        await _connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                new
                {
                    EventId = eventId,
                    UserId = userId
                },
                cancellationToken: cancellationToken));
    }
}
