namespace InfraLib.Models.Interfaces;

/// <summary>
/// Базовая контракт пользователя
/// </summary>
public interface IUserBase
{
    /// <summary>
    /// айди
    /// </summary>
    public Guid Id { get; init; }

    /// <summary>
    /// Имя
    /// </summary>
    public string Name { get; init; }

    /// <summary>
    /// Фамилия
    /// </summary>
    public string Surname { get; init; }

    /// <summary>
    /// 6-значный идентификатор (читательский номер)
    /// </summary>
    public string Identifier { get; init; }

    /// <summary>
    /// Логин
    /// </summary>
    public string Login { get; init; }

    /// <summary>
    /// Пароль
    /// </summary>
    public string Password { get; init; }

    /// <summary>
    /// Дата создания
    /// </summary>
    public DateTime CreatedAt { get; init; }
}