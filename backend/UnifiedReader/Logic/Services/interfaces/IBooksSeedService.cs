using Dal.Models.Books;

namespace Logic.Users;

/// <summary>
/// Сервис для заполнения таблицы книг тестовыми данными
/// </summary>
public interface IBooksSeedService
{
    Task SeedRandomBooksAsync(int count, CancellationToken cancellationToken);

    Task ResetWithSingleBookAsync(ClassBookEntity book, CancellationToken cancellationToken);
}