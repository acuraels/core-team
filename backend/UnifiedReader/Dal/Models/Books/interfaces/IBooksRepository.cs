namespace Dal.Models.Books.interfaces;

/// <summary>
/// Репозиторий книг
/// </summary>
public interface IBooksRepository
{
    Task<IReadOnlyCollection<ClassBookEntity>> GetAllAsync(CancellationToken cancellationToken);

    Task<ClassBookEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task CreateAsync(ClassBookEntity book, CancellationToken cancellationToken);

    Task UpdateAsync(ClassBookEntity book, CancellationToken cancellationToken);

    Task DeleteAsync(Guid id, CancellationToken cancellationToken);

    Task TruncateAsync(CancellationToken cancellationToken);

    Task BulkInsertAsync(IEnumerable<ClassBookEntity> books, CancellationToken cancellationToken);
}