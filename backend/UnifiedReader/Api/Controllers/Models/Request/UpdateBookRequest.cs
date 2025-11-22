namespace Api.Controllers.Models.Request;

/// <summary>
/// Обновление книги
/// </summary>
public sealed class UpdateBookRequest
{
    public string Name { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    public int PublishedYear { get; init; }

    public string Author { get; init; } = string.Empty;

    public string Isbn { get; init; } = string.Empty;
}
