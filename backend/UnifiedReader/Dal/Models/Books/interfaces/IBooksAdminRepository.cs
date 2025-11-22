namespace Dal.Models.Books.interfaces;

public interface IBooksAdminRepository
{
    Task DropTablesAsync(CancellationToken cancellationToken);
}