using Api.Controllers.Models.Request;
using FluentValidation;

namespace Api.Validation;

/// <summary>
/// Валидатор запроса создания пользователя
/// </summary>
public sealed class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    /// <summary>
    /// Конструктор валидатора запроса создания пользователя
    /// </summary>
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Имя пользователя не должно быть пустым")
            .MaximumLength(200)
            .WithMessage("Имя пользователя не должно превышать 200 символов");

        RuleFor(x => x.Surname)
            .NotEmpty()
            .WithMessage("Фамилия не должна быть пустой")
            .MaximumLength(200)
            .WithMessage("Фамилия пользователя не должна превышать 200 символов");

        RuleFor(x => x.Login)
            .NotEmpty()
            .WithMessage("Логин не должен быть пустым")
            .MaximumLength(100)
            .WithMessage("Логин не должен превышать 100 символов");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Пароль не должен быть пустым")
            .MinimumLength(6)
            .WithMessage("Пароль не должен быть короче 6 символов");

        RuleFor(x => x.Role)
            .IsInEnum()
            .WithMessage("Некорректная роль пользователя");
    }
}
