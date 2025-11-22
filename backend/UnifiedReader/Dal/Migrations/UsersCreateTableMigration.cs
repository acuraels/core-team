using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Users.Migrations;

/// <summary>
/// Миграция создания таблицы пользователей
/// </summary>
public sealed class UsersCreateTableMigration : IDatabaseMigration
{
    /// <summary>
    /// Соединение
    /// </summary>
    private readonly IDbConnection _connection;
    
    /// <summary>
    /// Логгер
    /// </summary>
    private readonly ILogger<UsersCreateTableMigration> _logger;

    public UsersCreateTableMigration(
        IDbConnection connection,
        ILogger<UsersCreateTableMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task ApplyAsync(CancellationToken cancellationToken)
    {
        const string sql = @"
CREATE TABLE IF NOT EXISTS users
(
    id uuid PRIMARY KEY,
    name text NOT NULL,
    surname text NOT NULL,
    identifier varchar(6) NOT NULL UNIQUE,
    login text NOT NULL UNIQUE,
    password text NOT NULL,
    role int NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_users_role ON users(role);
CREATE INDEX IF NOT EXISTS ix_users_identifier ON users(identifier);
CREATE INDEX IF NOT EXISTS ix_users_login ON users(login);
";

        if (_connection.State != ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции создания таблицы users");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: cancellationToken));
    }
}
