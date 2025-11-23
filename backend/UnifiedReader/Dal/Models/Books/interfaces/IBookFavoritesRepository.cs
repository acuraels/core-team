namespace Dal.Models.Books.interfaces;

/// <summary>
/// Репозиторий избранных книг
/// </summary>
public interface IBookFavoritesRepository
{
    /// <summary>
    /// Добавелние в избранное
    /// </summary>
    Task AddAsync(Guid userId, Guid classBookId, CancellationToken cancellationToken);

    /// <summary>
    /// удаление из избранного
    /// </summary>
    Task RemoveAsync(Guid userId, Guid classBookId, CancellationToken cancellationToken);
}