namespace Api.Controllers.Models.Request;

/// <summary>
/// refresh request
/// </summary>
public sealed class RefreshRequest
{
    /// <summary>
    /// Токен обновления доступа
    /// </summary>
    public string RefreshToken { get; init; } = string.Empty;
}