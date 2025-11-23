using System.Data;
using Dal.Models.Books.interfaces;
using Dapper;

namespace Dal.Repository;

/// <summary>
/// Репозиторий для работы с бронированиями книг
/// </summary>
public sealed class BookingsRepository : IBookingsRepository
{
    /// <summary>
    /// Подключение к базе данных
    /// </summary>
    private readonly IDbConnection _connection;

    /// <summary>
    /// Создает экземпляр репозитория бронирований
    /// </summary>
    /// <param name="connection">Подключение к базе данных</param>
    public BookingsRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <summary>
    /// Создать бронирование экземпляра книги
    /// </summary>
    /// <param name="objectBookId">Идентификатор экземпляра книги</param>
    /// <param name="userId">Идентификатор пользователя</param>
    /// <param name="bookingEnd">Дата и время окончания бронирования</param>
    /// <param name="cancellationToken">Токен отмены операции</param>
    /// <returns>Идентификатор созданного бронирования</returns>
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

    /// <summary>
    /// Гарантирует, что подключение к базе данных открыто
    /// </summary>
    private void EnsureConnectionOpened()
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }
    }
}