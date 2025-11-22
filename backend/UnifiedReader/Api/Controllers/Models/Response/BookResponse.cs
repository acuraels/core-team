namespace Api.Controllers.Models.Response;

/// <summary>
/// Ответ по книге
/// </summary>
public sealed class BookResponse
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    public int PublishedYear { get; init; }

    public string Author { get; init; } = string.Empty;

    public string? ImgPath { get; init; }

    public string Isbn { get; init; } = string.Empty;
}
