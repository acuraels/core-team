using Dal.Users.interfaces;
using InfraLib.Models;

namespace Api.Controllers.Models.Request;

/// <summary>
/// request модель создания пользователя
/// </summary>
public class CreateUserRequest : IUserRole
{
    /// <summary>
    /// Имя
    /// </summary>
    public string Name { get; init; } = string.Empty;

    /// <summary>
    /// Фамилия
    /// </summary>
    public string Surname { get; init; } = string.Empty;

    /// <summary>
    /// Логин
    /// </summary>
    public string Login { get; init; } = string.Empty;

    /// <summary>
    /// Пароль
    /// </summary>
    public string Password { get; init; } = string.Empty;

    /// <inheritdoc />
    public UserRole Role { get; init; }
}