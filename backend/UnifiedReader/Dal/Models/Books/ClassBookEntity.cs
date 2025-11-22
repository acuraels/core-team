namespace Dal.Models.Books;

/// <summary>
/// Класс книги
/// </summary>
public sealed class ClassBookEntity
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int PublishedYear { get; set; }

    public string Author { get; set; } = string.Empty;

    public string? ImgPath { get; set; }

    public string Isbn { get; set; } = string.Empty;
}