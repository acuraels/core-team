namespace Api.Controllers.Models.Request;

/// <summary>
/// Запрос логина
/// </summary>
public sealed class LoginRequest
{
    /// <summary>
    /// Логин
    /// </summary>
    public string Login { get; init; } = string.Empty;

    /// <summary>
    /// Пароль
    /// </summary>
    public string Password { get; init; } = string.Empty;
}