namespace Dal.Models.Books;

/// <summary>
/// Класс книги
/// </summary>
public sealed class ClassBookEntity
{
    /// <summary>
    /// Идентификатор книги
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Название книги
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Описание книги
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Год публикации книги
    /// </summary>
    public int PublishedYear { get; set; }

    /// <summary>
    /// Автор книги
    /// </summary>
    public string Author { get; set; } = string.Empty;

    /// <summary>
    /// Путь к изображению книги
    /// </summary>
    public string? ImgPath { get; set; }

    /// <summary>
    /// ISBN книги
    /// </summary>
    public string Isbn { get; set; } = string.Empty;
}