namespace Api.Controllers.Models.Response;

public sealed class EventResponse
{
    public long Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? Description { get; init; }

    public DateTime StartAt { get; init; }

    public DateTime EndAt { get; init; }

    public string? EventImage { get; init; }

    public int RegistrationsCount { get; init; }

    public int VisitorsCount { get; init; }
}
