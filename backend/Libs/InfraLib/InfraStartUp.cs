using InfraLib.Database;
using Microsoft.Extensions.DependencyInjection;

namespace InfraLib;

/// <summary>
/// Инфраструктура
/// </summary>
public static class InfraStartUp
{
    /// <summary>
    /// Добавление инфраструктуры
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddPostgres();
        return services;
    }
}