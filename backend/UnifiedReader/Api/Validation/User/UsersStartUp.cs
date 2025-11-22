using Api.Controllers.Models.Request;
using Dal.Models.Books.interfaces;
using Dal.Repository;
using Dal.Tokens.interfaces;
using Dal.Users;
using Dal.Users.Migrations;
using FluentValidation;
using InfraLib.Database.Migration;
using Logic.Users;

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
        services.AddScoped<IValidator<LoginRequest>, LoginRequestValidator>();

        return services;
    }
}