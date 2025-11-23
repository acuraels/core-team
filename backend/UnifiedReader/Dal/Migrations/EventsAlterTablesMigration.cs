using System.Data;
using Dapper;
using InfraLib.Database.Migration;
using Microsoft.Extensions.Logging;

namespace Dal.Users.Migrations;

/// <summary>
/// Миграция добаления reg_datetime в event_regs и event_image в events
/// </summary>
public sealed class EventsAlterTablesMigration : IDatabaseMigration
{
    /// <summary>
    /// Подключение к базе данных
    /// </summary>
    private readonly IDbConnection _connection;

    /// <summary>
    /// Логгер миграции изменения таблиц событий
    /// </summary>
    private readonly ILogger<EventsAlterTablesMigration> _logger;

    /// <summary>
    /// Создает экземпляр миграции изменения таблиц событий
    /// </summary>
    /// <param name="connection">Подключение к базе данных</param>
    /// <param name="logger">Логгер миграции</param>
    public EventsAlterTablesMigration(
        IDbConnection connection,
        ILogger<EventsAlterTablesMigration> logger)
    {
        _connection = connection;
        _logger = logger;
    }

    /// <summary>
    /// Применяет изменения для таблиц events и event_regs
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции</param>
    public async Task ApplyAsync(CancellationToken cancellationToken)
    {
        const string sql = @"
ALTER TABLE events
    ADD COLUMN IF NOT EXISTS event_image text NULL;

ALTER TABLE event_regs
    ADD COLUMN IF NOT EXISTS reg_datetime timestamp with time zone NOT NULL DEFAULT now();

ALTER TABLE event_regs
    ADD COLUMN IF NOT EXISTS is_visited boolean NOT NULL DEFAULT false;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        _logger.LogInformation("Применение миграции изменения таблиц events и event_regs");

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            cancellationToken: cancellationToken));
    }
}