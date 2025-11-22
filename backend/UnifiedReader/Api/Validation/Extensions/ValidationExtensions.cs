using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Api.Validation.Extensions;

/// <summary>
/// Расширение для fluent валидации
/// </summary>
internal static class ValidationExtensions
{
    /// <summary>
    /// Добавление ошибок fluent в state
    /// </summary>
    public static void AddErrors(this ModelStateDictionary modelState, ValidationResult? validationResult)
    {
        if (validationResult is null)
        {
            return;
        }

        foreach (var error in validationResult.Errors)
        {
            modelState.AddModelError(error.PropertyName, error.ErrorMessage);
        }
    }
}