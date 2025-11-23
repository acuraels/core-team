using System.Data;
using Dal.Models.Books.interfaces;
using Dapper;

namespace Dal.Repository;

/// <summary>
/// Репозиторий административных операций над доменом книг
/// </summary>
public sealed class BooksAdminRepository : IBooksAdminRepository
{
    /// <summary>
    /// Подключение к базе данных
    /// </summary>
    private readonly IDbConnection _connection;

    /// <summary>
    /// Создает экземпляр административного репозитория домена книг
    /// </summary>
    public BooksAdminRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    /// <summary>
    /// Удалить все таблицы домена книг
    /// </summary>
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
            new CommandDefinition(
                sql,
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