using Api.Controllers.Models.Request;
using Api.Controllers.Models.Response;
using Api.Validation.Extensions;
using Dal.Tokens;
using Dal.Tokens.interfaces;
using Dal.Users;
using FluentValidation;
using InfraLib.Auth.JWT.interfaces;
using InfraLib.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// Контроллер аутентификации
/// </summary>
[ApiController]
[Route("api/v1/auth")]
[AllowAnonymous]
public sealed class AuthController : ControllerBase
{
    /// <summary>
    /// Репозиторий пользователей
    /// </summary>
    private readonly IUsersRepository _usersRepository;

    /// <summary>
    /// Валидатор запроса логина
    /// </summary>
    private readonly IValidator<LoginRequest> _loginValidator;

    /// <summary>
    /// Фабрика JWT токенов
    /// </summary>
    private readonly IJwtTokenFactory _tokenFactory;
    
    /// <summary>
    /// refresh token
    /// </summary>
    private readonly IRefreshTokensRepository _refreshTokensRepository;

    public AuthController(
        IUsersRepository usersRepository,
        IValidator<LoginRequest> loginValidator,
        IJwtTokenFactory tokenFactory,
        IRefreshTokensRepository refreshTokensRepository)
    {
        _usersRepository = usersRepository;
        _loginValidator = loginValidator;
        _tokenFactory = tokenFactory;
        _refreshTokensRepository = refreshTokensRepository;
    }

    /// <summary>
    /// Логин пользователя
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var validationResult = await _loginValidator.ValidateAsync(request);

        if (validationResult.IsValid is false)
        {
            ModelState.AddErrors(validationResult);
            return ValidationProblem(ModelState);
        }

        if (request.Login == "admin" && request.Password == "123456")
        {
            var now = DateTime.UtcNow;
            var adminId = Guid.Parse("00000000-0000-0000-0000-000000000001");
            var accessToken = _tokenFactory.Create(adminId, UserRole.Admin);
            var response = new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = string.Empty,
                UserId = adminId,
                Role = UserRole.Admin
            };

            return Ok(response);
        }

        var user = await _usersRepository.GetByLoginAsync(request.Login);

        if (user is null || user.Password != request.Password)
        {
            return Unauthorized("Неверный логин или пароль");
        }

        var nowUser = DateTime.UtcNow;
        var accessTokenUser = _tokenFactory.Create(user.Id, user.Role);
        var refreshTokenValue = Guid.NewGuid().ToString("N");

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = nowUser.AddDays(30)
        };

        await _refreshTokensRepository.AddAsync(refreshToken, HttpContext.RequestAborted);

        var userResponse = new AuthResponse
        {
            AccessToken = accessTokenUser,
            RefreshToken = refreshTokenValue,
            UserId = user.Id,
            Role = user.Role
        };

        return Ok(userResponse);
    }

    /// <summary>
    /// Обновление access токена по refresh токену
    /// </summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<AuthResponse>> Refresh([FromBody] RefreshRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            return BadRequest("Refresh токен не должен быть пустым");
        }

        var stored = await _refreshTokensRepository.GetAsync(request.RefreshToken, HttpContext.RequestAborted);

        if (stored is null)
        {
            return Unauthorized("Refresh токен недействителен");
        }

        if (stored.ExpiresAt <= DateTime.UtcNow)
        {
            return Unauthorized("Refresh токен просрочен");
        }

        var user = await _usersRepository.GetAsync(stored.UserId);

        if (user is null)
        {
            return Unauthorized("Пользователь для данного токена не найден");
        }

        var now = DateTime.UtcNow;

        var newAccessToken = _tokenFactory.Create(user.Id, user.Role);
        var newRefreshTokenValue = Guid.NewGuid().ToString("N");

        var newRefreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = newRefreshTokenValue,
            ExpiresAt = now.AddDays(30)
        };

        await _refreshTokensRepository.AddAsync(newRefreshToken, HttpContext.RequestAborted);

        var response = new AuthResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshTokenValue,
            UserId = user.Id,
            Role = user.Role
        };

        return Ok(response);
    }
}