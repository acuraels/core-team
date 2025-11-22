using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Users.Migrations;

public sealed class AdminCreateTableMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<AdminCreateTableMigration> _logger;

    public AdminCreateTableMigration(
        IDbConnection connection,
        ILogger<AdminCreateTableMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    public async Task ApplyAsync(CancellationToken cancellationToken)
    {
        const string sql = @"
CREATE TABLE IF NOT EXISTS admin
(
    id uuid PRIMARY KEY,
    login text NOT NULL UNIQUE,
    password text NOT NULL
);

INSERT INTO admin (id, login, password)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin', '123456')
ON CONFLICT (login) DO NOTHING;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции создания таблицы admin");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: cancellationToken));
    }
}