namespace Dal.Tokens;

/// <summary>
/// Модель токена обновления
/// </summary>
public sealed class RefreshToken
{
    /// <summary>
    /// Идентификатор токена обновления
    /// </summary>
    public Guid Id { get; init; }

    /// <summary>
    /// Идентификатор пользователя
    /// </summary>
    public Guid UserId { get; init; }

    /// <summary>
    /// Строковое значение токена
    /// </summary>
    public string Token { get; init; } = string.Empty;

    /// <summary>
    /// Время истечения срока действия токена
    /// </summary>
    public DateTime ExpiresAt { get; init; }
}