using System.Security.Claims;
using Api.Controllers.Models.Response;
using Api.Mapping.Response;
using Dal.Users;
using InfraLib.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// Контроллер действий администратора
/// </summary>
[ApiController]
[Route("api/v1/admin")]
[Authorize(Roles = nameof(UserRole.Admin))]
public sealed class AdminController : ControllerBase
{
    private readonly IUsersRepository _usersRepository;

    public AdminController(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }

    /// <summary>
    /// Информация о текущем администраторе
    /// </summary>
    [HttpGet("me")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
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

        var user = await _usersRepository.GetAsync(userId);

        if (user is null)
        {
            return NotFound($"Пользователь с идентификатором {userId} не найден");
        }

        var response = UserMap.MapToUserResponse(user);
        return Ok(response);
    }

    /// <summary>
    /// Проверка прав администратора
    /// </summary>
    [HttpGet("ping")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<string> Ping()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;

        if (string.IsNullOrWhiteSpace(role) || !string.Equals(role, nameof(UserRole.Admin), StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(StatusCodes.Status403Forbidden, "Недостаточно прав");
        }

        return Ok("Администратор авторизован");
    }
}
