using System.Data;
using Dal.Models.Books.interfaces;
using Dapper;

namespace Dal.Repository;

public sealed class BooksAdminRepository : IBooksAdminRepository
{
    private readonly IDbConnection _connection;

    public BooksAdminRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task DropTablesAsync(CancellationToken cancellationToken)
    {
        const string sql = @"
DROP TABLE IF EXISTS favorite_books CASCADE;
DROP TABLE IF EXISTS event_regs CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS readings CASCADE;
DROP TABLE IF EXISTS object_book CASCADE;
DROP TABLE IF EXISTS class_book CASCADE;
";

        EnsureConnectionOpened();

        await _connection.ExecuteAsync(
            new CommandDefinition(sql, cancellationToken: cancellationToken));
    }

    private void EnsureConnectionOpened()
    {
        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }
    }
}