namespace Dal.Models.Events.interfaces;

public interface IEventsRepository
{
    Task<IReadOnlyCollection<EventWithStats>> GetAllWithStatsAsync(CancellationToken cancellationToken);

    Task<EventWithStats?> GetByIdWithStatsAsync(long id, CancellationToken cancellationToken);

    Task<bool> ExistsAsync(long id, CancellationToken cancellationToken);

    Task RegisterAsync(long eventId, Guid userId, CancellationToken cancellationToken);

    Task MarkVisitedAsync(long eventId, Guid userId, CancellationToken cancellationToken);
}
