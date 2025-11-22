using Dal.Users.interfaces;
using InfraLib.Models.Interfaces;

namespace Dal.Users;

/// <summary>
/// Пользователь
/// </summary>
public sealed class User : IUserBase, IUserRole
{
    /// <inheritdoc />
    public Guid Id { get; init; }

    /// <inheritdoc />
    public string Name { get; init; } = string.Empty;

    /// <inheritdoc />
    public string Surname { get; init; } = string.Empty;

    /// <inheritdoc />
    public string Identifier { get; init; } = string.Empty;

    /// <inheritdoc />
    public string Login { get; init; } = string.Empty;

    /// <inheritdoc />
    public string Password { get; init; } = string.Empty;

    /// <inheritdoc />
    public DateTime CreatedAt { get; init; }

    /// <inheritdoc />
    public UserRole Role { get; init; }
}