using Api.Controllers.Models.Request;
using FluentValidation;

namespace Api.Validation;

/// <summary>
/// Валидатор запроса логина
/// </summary>
public sealed class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    /// <summary>
    /// Конструктор валидатора запроса входа
    /// </summary>
    public LoginRequestValidator()
    {
        RuleFor(x => x.Login)
            .NotEmpty()
            .WithMessage("Логин не должен быть пустым");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Пароль не должен быть пустым");
    }
}
