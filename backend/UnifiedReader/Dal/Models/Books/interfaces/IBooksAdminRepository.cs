namespace Dal.Models.Books.interfaces;

/// <summary>
/// Репозиторий админки
/// </summary>
public interface IBooksAdminRepository
{
    /// <summary>
    /// удаление всех таблиц
    /// </summary>
    Task DropTablesAsync(CancellationToken cancellationToken);
}