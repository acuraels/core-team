using InfraLib.Models;

namespace InfraLib.Auth.JWT.interfaces;

/// <summary>
/// Фабрика JWT токенов
/// </summary>
public interface IJwtTokenFactory
{
    /// <summary>
    /// Создание access токена
    /// </summary>
    string Create(Guid userId, UserRole role);
}