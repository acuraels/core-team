using System.Data;
using Dal.Models.Books.interfaces;
using Dapper;

namespace Dal.Repository;

public sealed class BookingsRepository : IBookingsRepository
{
    private readonly IDbConnection _connection;

    public BookingsRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<long> CreateBookingAsync(long objectBookId, Guid userId, DateTime bookingEnd, CancellationToken cancellationToken)
    {
        const string sql = @"
INSERT INTO bookings (book_id, user_id, booking_end, booking_times)
VALUES (@BookId, @UserId, @BookingEnd, 1)
RETURNING id;
";

        EnsureConnectionOpened();

        var id = await _connection.ExecuteScalarAsync<long>(
            new CommandDefinition(
                sql,
                new { BookId = objectBookId, UserId = userId, BookingEnd = bookingEnd },
                cancellationToken: cancellationToken));

        return id;
    }

    private void EnsureConnectionOpened()
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }
    }
}