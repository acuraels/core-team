namespace Dal.Models.Books.interfaces;

public interface IBookingsRepository
{
    Task<long> CreateBookingAsync(long objectBookId, Guid userId, DateTime bookingEnd, CancellationToken cancellationToken);
}