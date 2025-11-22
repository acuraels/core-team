using Api.Models.Request;
using Dal.Repository;
using Dal.Users;
using Dal.Users.Migrations;
using FluentValidation;
using InfraLib.Database.Migration;

namespace Api.Validation.User;

/// <summary>
/// Настройка сервисов пользователей
/// </summary>
public static class UsersStartUp
{
    /// <summary>
    /// Регистрация DI
    /// </summary>
    public static IServiceCollection AddUsers(this IServiceCollection services)
    {
        services.AddScoped<IValidator<CreateUserRequest>, CreateUserRequestValidator>();
        services.AddScoped<IValidator<UpdateUserRequest>, UpdateUserRequestValidator>();

        services.AddTransient<IUsersRepository, UsersRepository>();
        services.AddTransient<IDatabaseMigration, UsersCreateTableMigration>();

        return services;
    }
}