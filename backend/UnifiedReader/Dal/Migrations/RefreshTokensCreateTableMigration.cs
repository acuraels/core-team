using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Users.Migrations;

/// <summary>
/// refresh token migration
/// </summary>
public sealed class RefreshTokensCreateTableMigration : IDatabaseMigration
{
    /// <summary>
    /// Подключение к базе данных
    /// </summary>
    private readonly IDbConnection _connection;

    /// <summary>
    /// Логгер миграции создания таблицы refresh_tokens
    /// </summary>
    private readonly ILogger<RefreshTokensCreateTableMigration> _logger;

    /// <summary>
    /// Создает экземпляр миграции создания таблицы refresh_tokens
    /// </summary>
    /// <param name="connection">Подключение к базе данных</param>
    /// <param name="logger">Логгер миграции</param>
    public RefreshTokensCreateTableMigration(
        IDbConnection connection,
        ILogger<RefreshTokensCreateTableMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <summary>
    /// Применяет миграцию создания таблицы refresh_tokens
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции</param>
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