using InfraLib.Models;

namespace Api.Controllers.Models.Response;

/// <summary>
/// Ответ аутентификации
/// </summary>
public sealed class AuthResponse
{
    /// <summary>
    /// Access-токен
    /// </summary>
    public string AccessToken { get; init; } = string.Empty;

    /// <summary>
    /// Refresh-токен
    /// </summary>
    public string RefreshToken { get; init; } = string.Empty;

    /// <summary>
    /// Идентификатор пользователя
    /// </summary>
    public Guid UserId { get; init; }

    /// <summary>
    /// Роль пользователя
    /// </summary>
    public UserRole Role { get; init; }
}