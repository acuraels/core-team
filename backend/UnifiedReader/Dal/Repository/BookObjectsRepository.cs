using System.Data;
using Dal.Models.Books.interfaces;
using Dapper;

namespace Dal.Repository;

/// <summary>
/// объект книги
/// </summary>
public sealed class BookObjectsRepository : IBookObjectsRepository
{
    private readonly IDbConnection _connection;

    public BookObjectsRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <inheritdoc />
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
            new CommandDefinition(
                sql,
                new { ClassBookId = classBookId },
                cancellationToken: cancellationToken));

        return result;
    }

    /// <inheritdoc />
    public async Task MarkAsTakenAsync(long objectBookId, CancellationToken cancellationToken)
    {
        const string sql = @"
UPDATE object_book
SET is_taked = true
WHERE id = @Id;
";

        EnsureConnectionOpened();

        await _connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                new { Id = objectBookId },
                cancellationToken: cancellationToken));
    }

    /// <inheritdoc />
    public async Task<long> AddOneAsync(Guid classBookId, CancellationToken cancellationToken)
    {
        const string sql = @"
INSERT INTO object_book (class_book_id, status, is_taked)
VALUES (@ClassBookId, @Status, false)
RETURNING id;
";

        EnsureConnectionOpened();

        var id = await _connection.ExecuteScalarAsync<long>(
            new CommandDefinition(
                sql,
                new
                {
                    ClassBookId = classBookId,
                    Status = 0
                },
                cancellationToken: cancellationToken));

        return id;
    }

    /// <inheritdoc />
    public async Task AddManyAsync(Guid classBookId, int count, CancellationToken cancellationToken)
    {
        const string sql = @"
INSERT INTO object_book (class_book_id, status, is_taked)
VALUES (@ClassBookId, @Status, false);
";

        EnsureConnectionOpened();

        var items = Enumerable.Range(0, count)
            .Select(_ => new
            {
                ClassBookId = classBookId,
                Status = 0
            });

        await _connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                items,
                cancellationToken: cancellationToken));
    }

    /// <summary>
    /// Гарантирует, что подключение к базе данных открыто
    /// </summary>
    private void EnsureConnectionOpened()
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }
    }
}