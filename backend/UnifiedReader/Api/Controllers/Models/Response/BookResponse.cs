namespace Api.Controllers.Models.Response;

/// <summary>
/// Ответ по книге
/// </summary>
public sealed class BookResponse
{
    /// <summary>
    /// Идентификатор книги
    /// </summary>
    public Guid Id { get; init; }

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
    /// Путь к изображению книги
    /// </summary>
    public string? ImgPath { get; init; }

    /// <summary>
    /// ISBN книги
    /// </summary>
    public string Isbn { get; init; } = string.Empty;
}
