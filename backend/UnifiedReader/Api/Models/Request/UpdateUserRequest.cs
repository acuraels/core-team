using Dal.Users;
using Dal.Users.interfaces;

namespace Api.Models.Request;

/// <summary>
/// Обовление пользователя
/// </summary>
public class UpdateUserRequest : IUserRole
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