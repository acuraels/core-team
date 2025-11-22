namespace Api.Controllers.Models.Request;

/// <summary>
/// Запрос на бронирование книги
/// </summary>
public sealed class BookBookingRequest
{
    public DateTime BookingEnd { get; init; }
}