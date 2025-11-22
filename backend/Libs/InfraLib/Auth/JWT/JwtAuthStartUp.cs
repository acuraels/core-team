using System.Text;
using InfraLib.Auth.JWT.interfaces;
using InfraLib.Validation.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace InfraLib.Auth.JWT;

/// <summary>
/// Подключение JWT-аутентификации
/// </summary>
public static class JwtAuthStartUp
{
    /// <summary>
    /// Регистрация JWT аутентификации
    /// </summary>
    public static IServiceCollection AddJwtAuth(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<JwtOptions>()
            .BindConfiguration(configSectionPath: nameof(JwtOptions))
            .UseValidationOptions()
            .ValidateOnStart();

        var jwtSection = configuration.GetSection(nameof(JwtOptions));
        var jwtOptions = jwtSection.Get<JwtOptions>() ?? throw new InvalidOperationException("Секция JwtOptions не найдена в конфигурации");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SecretKey!));

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = !string.IsNullOrWhiteSpace(jwtOptions.Issuer),
                    ValidIssuer = jwtOptions.Issuer,
                    ValidateAudience = !string.IsNullOrWhiteSpace(jwtOptions.Audience),
                    ValidAudience = jwtOptions.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(1),
                    RoleClaimType = "role"
                };
            });

        services.AddSingleton<IJwtTokenFactory, JwtTokenFactory>();

        return services;
    }
}