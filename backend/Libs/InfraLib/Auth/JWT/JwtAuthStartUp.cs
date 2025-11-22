using System.Security.Claims;
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
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtOptions.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwtOptions.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(1),
                    RoleClaimType = "role",
                    NameClaimType = ClaimTypes.NameIdentifier
                };

                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        if (context.Principal?.Identity is not ClaimsIdentity identity)
                        {
                            return Task.CompletedTask;
                        }

                        var userId = identity.FindFirst("userId")?.Value
                                     ?? identity.FindFirst("sub")?.Value;

                        if (!string.IsNullOrWhiteSpace(userId) &&
                            identity.FindFirst(ClaimTypes.NameIdentifier) == null)
                        {
                            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, userId));
                        }

                        return Task.CompletedTask;
                    }
                };
            });

        services.AddSingleton<IJwtTokenFactory, JwtTokenFactory>();

        return services;
    }
}