namespace Dal.Models.Events.interfaces;

/// <summary>
/// Репозиторий для работы с событиями и их статистикой
/// </summary>
public interface IEventsRepository
{
    /// <summary>
    /// Получить все события с агрегированной статистикой
    /// </summary>
    Task<IReadOnlyCollection<EventWithStats>> GetAllWithStatsAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Получить событие по идентификатору с агрегированной статистикой
    /// </summary>
    Task<EventWithStats?> GetByIdWithStatsAsync(long id, CancellationToken cancellationToken);

    /// <summary>
    /// Проверить существование события по идентификатору
    /// </summary>
    Task<bool> ExistsAsync(long id, CancellationToken cancellationToken);

    /// <summary>
    /// Зарегистрировать пользователя на событие
    /// </summary>
    Task RegisterAsync(long eventId, Guid userId, CancellationToken cancellationToken);

    /// <summary>
    /// Отметить посещение события пользователем
    /// </summary>
    Task MarkVisitedAsync(long eventId, Guid userId, CancellationToken cancellationToken);
    
    /// <summary>
    /// Создать событие
    /// </summary>
    Task<EventWithStats> CreateAsync(string name, string? description, DateTime startAt, DateTime endAt, string? eventImage, CancellationToken cancellationToken);
}