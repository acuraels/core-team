using Api.Controllers.Models.Request;
using Api.Controllers.Models.Response;
using Api.Validation.Extensions;
using Dal.Users;
using FluentValidation;
using InfraLib.Auth.JWT.interfaces;
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

    public AuthController(
        IUsersRepository usersRepository,
        IValidator<LoginRequest> loginValidator,
        IJwtTokenFactory tokenFactory)
    {
        _usersRepository = usersRepository;
        _loginValidator = loginValidator;
        _tokenFactory = tokenFactory;
    }

    /// <summary>
    /// Логин пользователя
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var validationResult = await _loginValidator.ValidateAsync(request);

        if (validationResult.IsValid is false)
        {
            ModelState.AddErrors(validationResult);
            return ValidationProblem(ModelState);
        }

        var user = await _usersRepository.GetByLoginAsync(request.Login);

        if (user is null || user.Password != request.Password)
        {
            return Unauthorized("Неверный логин или пароль");
        }

        var token = _tokenFactory.Create(user.Id, user.Role);

        var response = new AuthResponse
        {
            AccessToken = token,
            UserId = user.Id,
            Role = user.Role
        };

        return Ok(response);
    }
}