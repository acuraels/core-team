using System.Data;
using Dal.Models.Events;
using Dal.Models.Events.interfaces;
using Dapper;

namespace Dal.Repository.Events;

/// <summary>
/// Реализация репозитория событий
/// </summary>
public sealed class EventsRepository : IEventsRepository
{
    /// <summary>
    /// Подключение к базе данных
    /// </summary>
    private readonly IDbConnection _connection;

    /// <summary>
    /// Создает экземпляр репозитория событий
    /// </summary>
    /// <param name="connection">Подключение к базе данных</param>
    public EventsRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <inheritdoc />
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

    /// <inheritdoc />
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

    /// <inheritdoc />
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

    /// <inheritdoc />
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

    /// <inheritdoc />
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
    
    /// <inheritdoc />
    public async Task<EventWithStats> CreateAsync(
        string name,
        string? description,
        DateTime startAt,
        DateTime endAt,
        string? eventImage,
        CancellationToken cancellationToken)
    {
        const string sql = @"
INSERT INTO events (name, description, start_at, end_at, event_image)
VALUES (@Name, @Description, @StartAt, @EndAt, @EventImage)
RETURNING 
    id,
    name,
    description,
    start_at AS StartAt,
    end_at AS EndAt,
    event_image AS EventImage,
    0 AS RegistrationsCount,
    0 AS VisitorsCount;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        var created = await _connection.QuerySingleAsync<EventWithStats>(
            new CommandDefinition(
                sql,
                new
                {
                    Name = name,
                    Description = description,
                    StartAt = startAt,
                    EndAt = endAt,
                    EventImage = eventImage
                },
                cancellationToken: cancellationToken));

        return created;
    }
}
