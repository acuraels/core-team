namespace Dal.Models.Books.interfaces;

/// <summary>
/// Репозиторий книг
/// </summary>
public interface IBookingsRepository
{
    /// <summary>
    /// Создание экземпляра книг
    /// </summary>
    Task<long> CreateBookingAsync(long objectBookId, Guid userId, DateTime bookingEnd, CancellationToken cancellationToken);
}