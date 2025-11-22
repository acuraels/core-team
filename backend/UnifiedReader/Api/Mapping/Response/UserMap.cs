using Api.Controllers.Models.Response;
using Dal.Users;

namespace Api.Mapping.Response;

/// <summary>
/// Маппер моделей пользователя
/// </summary>
internal static class UserMap
{
    /// <summary>
    /// Преобразование доменной модели пользователя в response
    /// </summary>
    internal static UserResponse MapToResponse(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Identifier = user.Identifier,
            Login = user.Login,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }
}