namespace Dal.Users;

/// <summary>
/// Репозиторий пользователей
/// </summary>
public interface IUsersRepository
{
    /// <summary>
    /// Получение пользователя
    /// </summary>
    Task<User?> GetAsync(Guid id);

    /// <summary>
    /// Получение всех пользователей
    /// </summary>
    Task<IReadOnlyCollection<User>> GetAllAsync();

    /// <summary>
    /// Получение всех пользователей
    /// </summary>
    Task<Guid> CreateAsync(User user);

    /// <summary>
    /// Обновление данных пользователя
    /// </summary>    
    Task<bool> UpdateAsync(User user);

    /// <summary>
    /// Удаление пользователей
    /// </summary> 
    Task<bool> DeleteAsync(Guid id);
    
    /// <summary>
    /// Получение логина
    /// </summary>
    Task<User?> GetByLoginAsync(string login);
}