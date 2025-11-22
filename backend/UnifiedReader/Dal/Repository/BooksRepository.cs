using System.Data;
using Dal.Models.Books;
using Dal.Models.Books.interfaces;
using Dapper;

namespace Dal.Repository;

/// <summary>
/// Реализация репозитория книг
/// </summary>
public sealed class BooksRepository : IBooksRepository
{
    private readonly IDbConnection _connection;

    public BooksRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<IReadOnlyCollection<ClassBookEntity>> GetAllAsync(CancellationToken cancellationToken)
    {
        const string sql = @"
SELECT
    id,
    name,
    description,
    published_year AS PublishedYear,
    author,
    img_path AS ImgPath,
    isbn AS Isbn
FROM class_book
ORDER BY name;
";

        EnsureConnectionOpened();

        var result = await _connection.QueryAsync<ClassBookEntity>(
            new CommandDefinition(sql, cancellationToken: cancellationToken));

        return result.ToArray();
    }

    public async Task<ClassBookEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        const string sql = @"
SELECT
    id,
    name,
    description,
    published_year AS PublishedYear,
    author,
    img_path AS ImgPath,
    isbn AS Isbn
FROM class_book
WHERE id = @Id;
";

        EnsureConnectionOpened();

        var result = await _connection.QueryFirstOrDefaultAsync<ClassBookEntity>(
            new CommandDefinition(sql, new { Id = id }, cancellationToken: cancellationToken));

        return result;
    }

    public async Task CreateAsync(ClassBookEntity book, CancellationToken cancellationToken)
    {
        const string sql = @"
INSERT INTO class_book (id, name, description, published_year, author, img_path, isbn)
VALUES (@Id, @Name, @Description, @PublishedYear, @Author, @ImgPath, @Isbn);
";

        EnsureConnectionOpened();

        await _connection.ExecuteAsync(
            new CommandDefinition(sql, book, cancellationToken: cancellationToken));
    }

    public async Task UpdateAsync(ClassBookEntity book, CancellationToken cancellationToken)
    {
        const string sql = @"
UPDATE class_book
SET
    name = @Name,
    description = @Description,
    published_year = @PublishedYear,
    author = @Author,
    img_path = @ImgPath,
    isbn = @Isbn
WHERE id = @Id;
";

        EnsureConnectionOpened();

        await _connection.ExecuteAsync(
            new CommandDefinition(sql, book, cancellationToken: cancellationToken));
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        const string sql = @"DELETE FROM class_book WHERE id = @Id;";

        EnsureConnectionOpened();

        await _connection.ExecuteAsync(
            new CommandDefinition(sql, new { Id = id }, cancellationToken: cancellationToken));
    }

    public async Task TruncateAsync(CancellationToken cancellationToken)
    {
        const string sql = @"TRUNCATE TABLE class_book CASCADE;";

        EnsureConnectionOpened();

        await _connection.ExecuteAsync(new CommandDefinition(sql, cancellationToken: cancellationToken));
    }

    public async Task BulkInsertAsync(IEnumerable<ClassBookEntity> books, CancellationToken cancellationToken)
    {
        const string sql = @"
INSERT INTO class_book (id, name, description, published_year, author, img_path, isbn)
VALUES (@Id, @Name, @Description, @PublishedYear, @Author, @ImgPath, @Isbn);
";

        EnsureConnectionOpened();

        await _connection.ExecuteAsync(
            new CommandDefinition(sql, books, cancellationToken: cancellationToken));
    }

    private void EnsureConnectionOpened()
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }
    }
}