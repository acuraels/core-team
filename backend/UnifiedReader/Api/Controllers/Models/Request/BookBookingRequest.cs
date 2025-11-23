namespace Api.Controllers.Models.Request;

/// <summary>
/// Запрос на бронирование книги
/// </summary>
public sealed class BookBookingRequest
{
    /// <summary>
    /// До какого
    /// </summary>
    public DateTime BookingEnd { get; init; }
}