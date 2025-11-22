using System.Data;
using Dal.Models.Books.interfaces;
using Dapper;

namespace Dal.Repository;

public sealed class BookObjectsRepository : IBookObjectsRepository
{
    private readonly IDbConnection _connection;

    public BookObjectsRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<long?> GetFreeObjectIdForClassBookAsync(Guid classBookId, CancellationToken cancellationToken)
    {
        const string sql = @"
SELECT id
FROM object_book
WHERE class_book_id = @ClassBookId AND is_taked = false
ORDER BY id
LIMIT 1;
";

        EnsureConnectionOpened();

        var result = await _connection.QueryFirstOrDefaultAsync<long?>(
            new CommandDefinition(sql, new { ClassBookId = classBookId }, cancellationToken: cancellationToken));

        return result;
    }

    public async Task MarkAsTakenAsync(long objectBookId, CancellationToken cancellationToken)
    {
        const string sql = @"
UPDATE object_book
SET is_taked = true
WHERE id = @Id;
";

        EnsureConnectionOpened();

        await _connection.ExecuteAsync(
            new CommandDefinition(sql, new { Id = objectBookId }, cancellationToken: cancellationToken));
    }

    private void EnsureConnectionOpened()
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }
    }
}