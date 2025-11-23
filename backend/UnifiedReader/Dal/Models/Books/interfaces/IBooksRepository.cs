namespace Dal.Models.Books.interfaces;

/// <summary>
/// Репозиторий книг
/// </summary>
public interface IBooksRepository
{
    /// <summary>
    /// получение всех книг
    /// </summary>
    Task<IReadOnlyCollection<ClassBookEntity>> GetAllAsync(CancellationToken cancellationToken);

    /// <summary>
    /// получение книги
    /// </summary>
    Task<ClassBookEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    /// <summary>
    /// создание книги
    /// </summary>
    Task CreateAsync(ClassBookEntity book, CancellationToken cancellationToken);

    /// <summary>
    /// обновление данных книги
    /// </summary>
    Task UpdateAsync(ClassBookEntity book, CancellationToken cancellationToken);

    /// <summary>
    /// удаление книг
    /// </summary>
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);

    /// <summary>
    /// усекать
    /// </summary>
    Task TruncateAsync(CancellationToken cancellationToken);

    /// <summary>
    /// вставка
    /// </summary>
    Task BulkInsertAsync(IEnumerable<ClassBookEntity> books, CancellationToken cancellationToken);
}