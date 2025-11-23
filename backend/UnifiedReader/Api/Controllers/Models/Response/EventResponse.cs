namespace Api.Controllers.Models.Response;

/// <summary>
/// event response
/// </summary>
public sealed class EventResponse
{
    /// <summary>
    /// Идентификатор мероприятия
    /// </summary>
    public long Id { get; init; }

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

    /// <summary>
    /// Количество регистраций на мероприятие
    /// </summary>
    public int RegistrationsCount { get; init; }

    /// <summary>
    /// Количество посетителей мероприятия
    /// </summary>
    public int VisitorsCount { get; init; }
}
