using System.Data;
using Dal.Models.Books.interfaces;
using Dapper;

namespace Dal.Repository;

public sealed class BookFavoritesRepository : IBookFavoritesRepository
{
    private readonly IDbConnection _connection;

    public BookFavoritesRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task AddAsync(Guid userId, Guid classBookId, CancellationToken cancellationToken)
    {
        const string sql = @"
INSERT INTO favorite_books (user_id, class_book_id)
VALUES (@UserId, @ClassBookId)
ON CONFLICT (user_id, class_book_id) DO NOTHING;
";

        EnsureConnectionOpened();

        await _connection.ExecuteAsync(
            new CommandDefinition(sql, new { UserId = userId, ClassBookId = classBookId }, cancellationToken: cancellationToken));
    }

    public async Task RemoveAsync(Guid userId, Guid classBookId, CancellationToken cancellationToken)
    {
        const string sql = @"
DELETE FROM favorite_books
WHERE user_id = @UserId AND class_book_id = @ClassBookId;
";

        EnsureConnectionOpened();

        await _connection.ExecuteAsync(
            new CommandDefinition(sql, new { UserId = userId, ClassBookId = classBookId }, cancellationToken: cancellationToken));
    }

    private void EnsureConnectionOpened()
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }
    }
}