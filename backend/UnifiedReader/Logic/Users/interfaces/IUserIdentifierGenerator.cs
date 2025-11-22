namespace Logic.Users;

/// <summary>
/// Генератор идентификатора пользователя
/// </summary>
public interface IUserIdentifierGenerator
{
    /// <summary>
    /// Генерация 6-значного идентификатора
    /// </summary>
    string Generate();
}