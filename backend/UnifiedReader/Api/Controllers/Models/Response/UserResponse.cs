using Dal.Users.interfaces;
using InfraLib.Models;

namespace Api.Controllers.Models.Response;

/// <summary>
/// response модель
/// </summary>
public sealed class UserResponse : IUserRole
{
    /// <summary>
    /// айдим
    /// </summary>
    public Guid Id { get; init; }

    /// <summary>
    /// Имя
    /// </summary>
    public string Name { get; init; } = string.Empty;

    /// <summary>
    /// Фамилия
    /// </summary>
    public string Surname { get; init; } = string.Empty;

    /// <summary>
    /// 6-значный идентификатор (читательский номер)
    /// </summary>
    public string Identifier { get; init; } = string.Empty;

    /// <summary>
    /// Логин
    /// </summary>
    public string Login { get; init; } = string.Empty;

    /// <summary>
    /// Дата создания
    /// </summary>
    public DateTime CreatedAt { get; init; }

    /// <inheritdoc />
    public UserRole Role { get; init; }
}