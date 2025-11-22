namespace Dal.Models.Books.interfaces;

/// <summary>
/// Репозиторий избранных книг
/// </summary>
public interface IBookFavoritesRepository
{
    Task AddAsync(Guid userId, Guid classBookId, CancellationToken cancellationToken);

    Task RemoveAsync(Guid userId, Guid classBookId, CancellationToken cancellationToken);
}