namespace Dal.Models.Books.interfaces;

/// <summary>
/// Репозиторий экземпляра книг
/// </summary>
public interface IBookObjectsRepository
{
    /// <summary>
    /// получение object
    /// </summary>
    Task<long?> GetFreeObjectIdForClassBookAsync(Guid classBookId, CancellationToken cancellationToken);

    /// <summary>
    /// помечаем
    /// </summary>
    Task MarkAsTakenAsync(long objectBookId, CancellationToken cancellationToken);

    /// <summary>
    /// добавить один экземпляр
    /// </summary>
    Task<long> AddOneAsync(Guid classBookId, CancellationToken cancellationToken);

    /// <summary>
    /// добавить множество экземпляр
    /// </summary>
    Task AddManyAsync(Guid classBookId, int count, CancellationToken cancellationToken);
}
