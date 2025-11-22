namespace Dal.Tokens;

public sealed class RefreshToken
{
    public Guid Id { get; init; }

    public Guid UserId { get; init; }

    public string Token { get; init; } = string.Empty;
    public DateTime ExpiresAt { get; init; }
}