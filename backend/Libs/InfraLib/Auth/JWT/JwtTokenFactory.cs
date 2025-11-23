using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using InfraLib.Auth.JWT.interfaces;
using InfraLib.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace InfraLib.Auth.JWT;

/// <summary>
/// Реализация фабрики JWT токенов
/// </summary>
public sealed class JwtTokenFactory : IJwtTokenFactory
{
    /// <summary>
    /// опции
    /// </summary>
    private readonly JwtOptions _options;
    
    /// <summary>
    /// симетричный ключ
    /// </summary>
    private readonly SymmetricSecurityKey _key;

    public JwtTokenFactory(IOptions<JwtOptions> options)
    {
        _options = options.Value;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey!));
    }

    /// <inheritdoc />
    public string Create(Guid userId, UserRole role)
    {
        var now = DateTime.UtcNow;

        var claims = new List<Claim>
        {
            new ("userId", userId.ToString()),
            new ("role", role.ToString()),
            new (JwtRegisteredClaimNames.Sub, userId.ToString())
        };

        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            notBefore: now,
            expires: now.AddMinutes(_options.AccessTokenLifetimeMinutes),
            signingCredentials: credentials);

        var handler = new JwtSecurityTokenHandler();
        return handler.WriteToken(token);
    }
}