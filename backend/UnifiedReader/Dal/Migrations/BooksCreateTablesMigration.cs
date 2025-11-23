using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Users.Migrations;

/// <summary>
/// Миграция создания таблиц домена книг
/// </summary>
public sealed class BooksCreateTablesMigration : IDatabaseMigration
{
    /// <summary>
    /// Подключение к базе данных
    /// </summary>
    private readonly IDbConnection _connection;

    /// <summary>
    /// Логгер миграции домена книг
    /// </summary>
    private readonly ILogger<BooksCreateTablesMigration> _logger;

    /// <summary>
    /// Создает экземпляр миграции домена книг
    /// </summary>
    /// <param name="connection">Подключение к базе данных</param>
    /// <param name="logger">Логгер миграции</param>
    public BooksCreateTablesMigration(
        IDbConnection connection,
        ILogger<BooksCreateTablesMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <summary>
    /// Применяет миграцию домена книг
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции</param>
    public async Task ApplyAsync(CancellationToken cancellationToken)
    {
        const string sql = @"
CREATE TABLE IF NOT EXISTS class_book
(
    id uuid PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    published_year int NOT NULL,
    author text NOT NULL,
    img_path text NULL,
    isbn text NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_class_book_isbn ON class_book(isbn);

CREATE TABLE IF NOT EXISTS object_book
(
    id bigserial PRIMARY KEY,
    class_book_id uuid NOT NULL REFERENCES class_book(id) ON DELETE CASCADE,
    status int NOT NULL,
    is_taked boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS ix_object_book_class_book_id ON object_book(class_book_id);
CREATE INDEX IF NOT EXISTS ix_object_book_status ON object_book(status);

CREATE TABLE IF NOT EXISTS readings
(
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_book_id uuid NOT NULL REFERENCES class_book(id) ON DELETE CASCADE,
    is_liked boolean NOT NULL DEFAULT false,
    is_readed boolean NOT NULL DEFAULT false,
    PRIMARY KEY (user_id, class_book_id)
);

CREATE INDEX IF NOT EXISTS ix_readings_is_liked ON readings(is_liked);
CREATE INDEX IF NOT EXISTS ix_readings_is_readed ON readings(is_readed);

CREATE TABLE IF NOT EXISTS bookings
(
    id bigserial PRIMARY KEY,
    book_id bigint NOT NULL REFERENCES object_book(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_end timestamp with time zone NOT NULL,
    booking_times int NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS ix_bookings_book_id ON bookings(book_id);
CREATE INDEX IF NOT EXISTS ix_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS ix_bookings_booking_end ON bookings(booking_end);

CREATE TABLE IF NOT EXISTS events
(
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    description text NULL,
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS event_regs
(
    event_id bigint NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS ix_event_regs_event_id ON event_regs(event_id);
CREATE INDEX IF NOT EXISTS ix_event_regs_user_id ON event_regs(user_id);

CREATE TABLE IF NOT EXISTS favorite_books
(
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_book_id uuid NOT NULL REFERENCES class_book(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, class_book_id)
);

CREATE INDEX IF NOT EXISTS ix_favorite_books_class_book_id ON favorite_books(class_book_id);
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции домена книг");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: cancellationToken));
    }
}