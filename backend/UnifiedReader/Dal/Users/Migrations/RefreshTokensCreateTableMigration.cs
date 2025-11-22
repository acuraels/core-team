using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Users.Migrations;

public sealed class RefreshTokensCreateTableMigration : IDatabaseMigration
{
    private readonly IDbConnection _connection;
    private readonly ILogger<RefreshTokensCreateTableMigration> _logger;

    public RefreshTokensCreateTableMigration(
        IDbConnection connection,
        ILogger<RefreshTokensCreateTableMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    public async Task ApplyAsync(CancellationToken cancellationToken)
    {
        const string sql = @"
CREATE TABLE IF NOT EXISTS refresh_tokens
(
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL,
    token text NOT NULL UNIQUE,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS ix_refresh_tokens_token ON refresh_tokens(token);
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции создания таблицы refresh_tokens");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: cancellationToken));
    }
}