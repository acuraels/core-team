namespace Dal.Users.interfaces;

/// <summary>
/// Контракт для роли
/// </summary>
public interface IUserRole
{
    /// <summary>
    /// Роль пользователя
    /// </summary>
    public UserRole Role { get; init; }
}