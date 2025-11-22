using System.Collections.Immutable;
using Api.Controllers.Models.Request;
using Api.Controllers.Models.Response;
using Api.Mapping.Response;
using Api.Validation.Extensions;
using Dal.Users;
using FluentValidation;
using InfraLib.Models;
using Logic.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// Контроллер пользователя (читатель или библиотекарь)
/// </summary>
[ApiController]
[Route("api/v1/users")]
[Authorize]
public sealed class UsersController : ControllerBase
{
    /// <summary>
    /// Репозиторий пользователей
    /// </summary>
    private readonly IUsersRepository _repository;

    /// <summary>
    /// Валидатор запроса создания пользователя
    /// </summary>
    private readonly IValidator<CreateUserRequest> _createValidator;

    /// <summary>
    /// Валидатор запроса обновления пользователя
    /// </summary>
    private readonly IValidator<UpdateUserRequest> _updateValidator;

    /// <summary>
    /// Сервис создания пользователей
    /// </summary>
    private readonly IUserCreationService _userCreationService;

    public UsersController(
        IUsersRepository repository,
        IValidator<CreateUserRequest> createValidator,
        IValidator<UpdateUserRequest> updateValidator,
        IUserCreationService userCreationService)
    {
        _repository = repository;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _userCreationService = userCreationService;
    }

    /// <summary>
    /// Получение информации о текущем пользователе
    /// </summary>
    [HttpGet("me")]
    public async Task<ActionResult<UserResponse>> GetMe()
    {
        var userIdClaim = User.FindFirst("userId") ?? User.FindFirst("sub");

        if (userIdClaim is null)
        {
            return Unauthorized("Не найден идентификатор пользователя в токене");
        }

        if (Guid.TryParse(userIdClaim.Value, out var userId) is false)
        {
            return Unauthorized("Некорректный идентификатор пользователя в токене");
        }

        var user = await _repository.GetAsync(userId);

        if (user is null)
        {
            return NotFound($"Пользователь с идентификатором {userId} не найден");
        }

        var result = UserMap.MapToResponse(user);
        return Ok(result);
    }

    /// <summary>
    /// Получение пользователя по идентификатору
    /// </summary>
    [HttpGet("get/{id:guid}")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<UserResponse>> Get(Guid id)
    {
        var user = await _repository.GetAsync(id);

        if (user is null)
        {
            return NotFound($"Пользователь с идентификатором {id} не найден");
        }

        var result = UserMap.MapToResponse(user);

        return Ok(result);
    }

    /// <summary>
    /// Получение списка пользователей
    /// </summary>
    [HttpGet("get-all")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<IReadOnlyCollection<UserResponse>>> GetAll([FromQuery] UserRole? role)
    {
        var users = await _repository.GetAllAsync();

        if (role is not null)
        {
            users = users
                .Where(x => x.Role == role.Value)
                .ToImmutableList();
        }

        var response = users.Select(UserMap.MapToResponse);

        return Ok(response);
    }

    /// <summary>
    /// Создание пользователя
    /// </summary>
    /// <summary>
    /// Создание пользователя
    /// </summary>
    [HttpPost("create")]
    [ProducesResponseType(201)]
    [AllowAnonymous]
    public async Task<ActionResult<UserResponse>> Create([FromBody] CreateUserRequest request)
    {
        var validationResult = await _createValidator.ValidateAsync(request);

        if (validationResult.IsValid is false)
        {
            ModelState.AddErrors(validationResult);
            return ValidationProblem(ModelState);
        }

        var user = await _userCreationService.CreateAsync(
            request.Name,
            request.Surname,
            request.Login,
            request.Password,
            request.Role,
            HttpContext.RequestAborted);

        var response = UserMap.MapToResponse(user);

        return CreatedAtAction(nameof(Get), new
        {
            id = user.Id
        }, response);
    }

    /// <summary>
    /// Обновление данных пользователя
    /// </summary>
    [HttpPut("update/{id:guid}")]
    [ProducesResponseType(200)]
    public async Task<ActionResult<UserResponse>> Update(Guid id, [FromBody] UpdateUserRequest request)
    {
        var validationResult = await _updateValidator.ValidateAsync(request);

        if (validationResult.IsValid is false)
        {
            ModelState.AddErrors(validationResult);
            return ValidationProblem(ModelState);
        }

        var existing = await _repository.GetAsync(id);

        if (existing is null)
        {
            return NotFound($"Пользователь с идентификатором {id} не найден");
        }

        var updated = new User
        {
            Id = existing.Id,
            Name = request.Name,
            Surname = request.Surname,
            Identifier = existing.Identifier,
            Login = request.Login,
            Password = request.Password,
            Role = request.Role,
            CreatedAt = existing.CreatedAt
        };

        var result = await _repository.UpdateAsync(updated);

        if (result is false)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Не удалось обновить пользователя");
        }

        return Ok(UserMap.MapToResponse(updated));
    }

    /// <summary>
    /// Удаление пользователя
    /// </summary>
    [HttpDelete("delete/{id:guid}")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _repository.DeleteAsync(id);

        if (deleted is false)
        {
            return NotFound($"Пользователь с идентификатором {id} не найден");
        }

        return NoContent();
    }
}
