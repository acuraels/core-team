using Dal.Users;

namespace Logic.Users;

/// <summary>
/// Сервис создания пользователей
/// </summary>
public interface IUserCreationService
{
    /// <summary>
    /// Создать пользователя
    /// </summary>
    Task<User> CreateAsync(
        string name,
        string surname,
        string login,
        string password,
        UserRole role,
        CancellationToken cancellationToken);
}
