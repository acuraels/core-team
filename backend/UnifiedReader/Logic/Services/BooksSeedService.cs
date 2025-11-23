using Dal.Models.Books;
using Dal.Models.Books.interfaces;

namespace Logic.Users;

/// <summary>
/// Реализация сервиса заполнения книг
/// </summary>
public sealed class BooksSeedService : IBooksSeedService
{
    private readonly IBooksRepository _booksRepository;
    private readonly Random _random = new Random();

    public BooksSeedService(IBooksRepository booksRepository)
    {
        _booksRepository = booksRepository;
    }

    /// <inheritdoc />
    public async Task SeedRandomBooksAsync(int count, CancellationToken cancellationToken)
    {
        await _booksRepository.TruncateAsync(cancellationToken);

        var books = new List<ClassBookEntity>(count);
        var usedIsbns = new HashSet<string>(StringComparer.Ordinal);

        for (var i = 0; i < count; i++)
        {
            var isbn = GenerateUniqueIsbn(usedIsbns);

            var book = new ClassBookEntity
            {
                Id = Guid.NewGuid(),
                Name = $"Книга {i + 1}",
                Description = $"Описание книги {i + 1}",
                PublishedYear = 2000 + i,
                Author = $"Автор {i + 1}",
                ImgPath = null,
                Isbn = isbn
            };

            books.Add(book);
        }

        await _booksRepository.BulkInsertAsync(books, cancellationToken);
    }

    /// <inheritdoc />
    public async Task ResetWithSingleBookAsync(ClassBookEntity entity, CancellationToken cancellationToken)
    {
        await _booksRepository.TruncateAsync(cancellationToken);
        await _booksRepository.CreateAsync(entity, cancellationToken);
    }

    /// <summary>
    /// генерация уникального isbn
    /// </summary>
    private string GenerateUniqueIsbn(ISet<string> usedIsbns)
    {
        while (true)
        {
            var isbn = GenerateRandomIsbn();

            if (!usedIsbns.Add(isbn))
            {
                continue;
            }

            return isbn;
        }
    }

    /// <summary>
    /// генерация радномного isbn
    /// </summary>
    private string GenerateRandomIsbn()
    {
        var buffer = new char[13];

        for (var i = 0; i < buffer.Length; i++)
        {
            var digit = _random.Next(0, 10);
            buffer[i] = (char)('0' + digit);
        }

        return new string(buffer);
    }
}