namespace Api.Controllers.Models.Request;

/// <summary>
/// Обновление книги
/// </summary>
public sealed class UpdateBookRequest
{
    /// <summary>
    /// Название книги
    /// </summary>
    public string Name { get; init; } = string.Empty;

    /// <summary>
    /// Описание книги
    /// </summary>
    public string Description { get; init; } = string.Empty;

    /// <summary>
    /// Год публикации книги
    /// </summary>
    public int PublishedYear { get; init; }

    /// <summary>
    /// Автор книги
    /// </summary>
    public string Author { get; init; } = string.Empty;

    /// <summary>
    /// ISBN книги
    /// </summary>
    public string Isbn { get; init; } = string.Empty;
}
