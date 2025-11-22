using Microsoft.Extensions.Options;

namespace InfraLib.Auth.JWT;

/// <summary>
/// Настройки JWT
/// </summary>
public sealed class JwtOptions : IValidateOptions<JwtOptions>
{
    /// <summary>
    /// Issuer токена
    /// </summary>
    public string? Issuer { get; init; }

    /// <summary>
    /// Audience токена
    /// </summary>
    public string? Audience { get; init; }

    /// <summary>
    /// Секретный ключ
    /// </summary>
    public string? SecretKey { get; init; }

    /// <summary>
    /// Время жизни access токена в минутах
    /// </summary>
    public int AccessTokenLifetimeMinutes { get; init; } = 60;

    /// <inheritdoc />
    public ValidateOptionsResult Validate(string? name, JwtOptions options)
    {
        if (string.IsNullOrWhiteSpace(options.SecretKey))
        {
            return ValidateOptionsResult.Fail("Секретный ключ JWT не должен быть пустым");
        }

        if (options.SecretKey.Length < 32)
        {
            return ValidateOptionsResult.Fail("Секретный ключ JWT должен быть не короче 32 символов");
        }

        if (options.AccessTokenLifetimeMinutes <= 0)
        {
            return ValidateOptionsResult.Fail("Время жизни access токена должно быть больше нуля");
        }

        return ValidateOptionsResult.Success;
    }
}