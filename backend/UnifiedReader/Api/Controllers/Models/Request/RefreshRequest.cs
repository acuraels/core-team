namespace Api.Controllers.Models.Request;

public sealed class RefreshRequest
{
    public string RefreshToken { get; init; } = string.Empty;
}