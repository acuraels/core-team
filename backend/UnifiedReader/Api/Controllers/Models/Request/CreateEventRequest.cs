namespace Api.Controllers.Models.Request;

/// <summary>
/// Модель запроса для создания мероприятия
/// </summary>
public sealed class CreateEventRequest
{
    /// <summary>
    /// Название мероприятия
    /// </summary>
    public string Name { get; init; } = string.Empty;

    /// <summary>
    /// Описание мероприятия
    /// </summary>
    public string? Description { get; init; }

    /// <summary>
    /// Дата и время начала мероприятия
    /// </summary>
    public DateTime StartAt { get; init; }

    /// <summary>
    /// Дата и время окончания мероприятия
    /// </summary>
    public DateTime EndAt { get; init; }

    /// <summary>
    /// Путь к изображению мероприятия
    /// </summary>
    public string? EventImage { get; init; }
}
