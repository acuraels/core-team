using Logic.Users;
using Microsoft.Extensions.DependencyInjection;

namespace Logic;

public static class LogicStartUp
{
    /// <summary>
    /// Добавление логики пользователей
    /// </summary>
    public static IServiceCollection AddLogic(this IServiceCollection services)
    {
        services.AddSingleton<IUserIdentifierGenerator, UserIdentifierGenerator>();
        services.AddTransient<IUserCreationService, UserCreationService>();

        return services;
    }
}
