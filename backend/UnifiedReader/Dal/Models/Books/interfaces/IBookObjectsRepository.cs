namespace Dal.Models.Books.interfaces;

public interface IBookObjectsRepository
{
    Task<long?> GetFreeObjectIdForClassBookAsync(Guid classBookId, CancellationToken cancellationToken);

    Task MarkAsTakenAsync(long objectBookId, CancellationToken cancellationToken);
}