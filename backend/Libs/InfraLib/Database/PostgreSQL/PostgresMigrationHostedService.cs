using InfraLib.Database.Migration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace InfraLib.Database.PostgreSQL;

/// <summary>
/// Фоновый сервис применения миграций Postgres
/// </summary>
public sealed class PostgresMigrationHostedService : IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IOptions<PostgresOptions> _options;
    private readonly ILogger<PostgresMigrationHostedService> _logger;

    public PostgresMigrationHostedService(
        IServiceProvider serviceProvider,
        IOptions<PostgresOptions> options,
        ILogger<PostgresMigrationHostedService> logger)
    {
        _serviceProvider = serviceProvider;
        _options = options;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        if (_options.Value.AutoMigration is false)
        {
            _logger.LogInformation("Автоматическое применение миграций отключено");
            return;
        }

        _logger.LogInformation("Начато применение миграций Postgres");

        using (var scope = _serviceProvider.CreateScope())
        {
            var migrations = 
                scope.ServiceProvider.GetServices<IDatabaseMigration>().ToList();

            if (!migrations.Any())
            {
                _logger.LogInformation("Миграции Postgres не найдены");
                return;
            }

            foreach (var migration in migrations)
            {
                if (cancellationToken.IsCancellationRequested)
                {
                    break;
                }

                await migration.ApplyAsync(cancellationToken);
            }
        }

        _logger.LogInformation("Применение миграций завершено");
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
