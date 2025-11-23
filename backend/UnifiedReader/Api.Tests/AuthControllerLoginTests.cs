using Api.Controllers;
using Api.Controllers.Models.Request;
using Api.Controllers.Models.Response;
using Dal.Tokens;
using Dal.Tokens.interfaces;
using Dal.Users;
using FluentValidation;
using InfraLib.Auth.JWT.interfaces;
using InfraLib.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Assert = Xunit.Assert;
using ValidationFailure = FluentValidation.Results.ValidationFailure;
using ValidationResult = FluentValidation.Results.ValidationResult;

namespace Api.Tests;

public sealed class AuthControllerLoginTests
{
    private readonly Mock<IUsersRepository> _usersRepository = new();
    private readonly Mock<IValidator<LoginRequest>> _loginValidator = new();
    private readonly Mock<IJwtTokenFactory> _tokenFactory = new();
    private readonly Mock<IRefreshTokensRepository> _refreshTokensRepository = new();

    private AuthController CreateController()
    {
        var controller = new AuthController(
            _usersRepository.Object,
            _loginValidator.Object,
            _tokenFactory.Object,
            _refreshTokensRepository.Object);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };

        return controller;
    }

    private static ValidationResult CreateInvalidValidationResult()
    {
        return new ValidationResult(new[]
        {
            new ValidationFailure("Login", "Логин обязателен")
        });
    }

    /// <summary>
    /// T1: Невалидный запрос логина ValidationProblem (400)
    /// </summary>
    [Fact]
    public async Task Login_InvalidRequest_ReturnsValidationProblem()
    {
        // Arrange
        var controller = CreateController();

        var request = new LoginRequest
        {
            Login = string.Empty,
            Password = string.Empty
        };

        _loginValidator
            .Setup(v => v.ValidateAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(CreateInvalidValidationResult());

        // Act
        var actionResult = await controller.Login(request);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(actionResult.Result);
        var problemDetails = Assert.IsType<ValidationProblemDetails>(objectResult.Value);

        Assert.Contains("Login", problemDetails.Errors.Keys);

        _loginValidator.Verify(
            v => v.ValidateAsync(request, It.IsAny<CancellationToken>()),
            Times.Once);

        _usersRepository.Verify(
            r => r.GetByLoginAsync(It.IsAny<string>()),
            Times.Never);

        _refreshTokensRepository.Verify(
            r => r.AddAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    /// <summary>
    /// T2: Логин админа с корректным паролем 200, access-token, без refresh-token
    /// </summary>
    [Fact]
    public async Task Login_AdminCredentials_ReturnsOkWithAdminAuthResponse()
    {
        // Arrange
        var controller = CreateController();

        var request = new LoginRequest
        {
            Login = "admin",
            Password = "123456"
        };

        _loginValidator
            .Setup(v => v.ValidateAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        var adminId = Guid.Parse("00000000-0000-0000-0000-000000000001");

        _tokenFactory
            .Setup(f => f.Create(adminId, UserRole.Admin))
            .Returns("admin-jwt-token");

        // Act
        var actionResult = await controller.Login(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var response = Assert.IsType<AuthResponse>(okResult.Value);

        Assert.Equal("admin-jwt-token", response.AccessToken);
        Assert.Equal(string.Empty, response.RefreshToken);
        Assert.Equal(adminId, response.UserId);
        Assert.Equal(UserRole.Admin, response.Role);

        _loginValidator.Verify(
            v => v.ValidateAsync(request, It.IsAny<CancellationToken>()),
            Times.Once);

        _usersRepository.Verify(
            r => r.GetByLoginAsync(It.IsAny<string>()),
            Times.Never);

        _refreshTokensRepository.Verify(
            r => r.AddAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    /// <summary>
    /// T3: Пользователь не найден 401 "Неверный логин или пароль"
    /// </summary>
    [Fact]
    public async Task Login_UserNotFound_ReturnsUnauthorized()
    {
        // Arrange
        var controller = CreateController();

        var request = new LoginRequest
        {
            Login = "user",
            Password = "pwd"
        };

        _loginValidator
            .Setup(v => v.ValidateAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _usersRepository
            .Setup(r => r.GetByLoginAsync(request.Login))
            .ReturnsAsync((User?)null);

        // Act
        var actionResult = await controller.Login(request);

        // Assert
        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(actionResult.Result);
        Assert.Equal("Неверный логин или пароль", unauthorized.Value);

        _usersRepository.Verify(
            r => r.GetByLoginAsync(request.Login),
            Times.Once);

        _refreshTokensRepository.Verify(
            r => r.AddAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    /// <summary>
    /// T4: Пользователь найден, но пароль не совпадает 401 "Неверный логин или пароль"
    /// </summary>
    [Fact]
    public async Task Login_WrongPassword_ReturnsUnauthorized()
    {
        // Arrange
        var controller = CreateController();

        var request = new LoginRequest
        {
            Login = "user",
            Password = "wrong"
        };

        _loginValidator
            .Setup(v => v.ValidateAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        var user = new User
        {
            Id = Guid.NewGuid(),
            Login = "user",
            Password = "correct",
            Name = "Test",
            Surname = "User",
            Identifier = "000001",
            Role = UserRole.Reader,
            CreatedAt = DateTime.UtcNow
        };

        _usersRepository
            .Setup(r => r.GetByLoginAsync(request.Login))
            .ReturnsAsync(user);

        // Act
        var actionResult = await controller.Login(request);

        // Assert
        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(actionResult.Result);
        Assert.Equal("Неверный логин или пароль", unauthorized.Value);

        _usersRepository.Verify(
            r => r.GetByLoginAsync(request.Login),
            Times.Once);

        _refreshTokensRepository.Verify(
            r => r.AddAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    /// <summary>
    /// T5: Успешный логин обычного пользователя 200, access + refresh, токен сохранён
    /// </summary>
    [Fact]
    public async Task Login_ValidUserCredentials_ReturnsOkAndCreatesRefreshToken()
    {
        // Arrange
        var controller = CreateController();

        var request = new LoginRequest
        {
            Login = "user",
            Password = "pwd"
        };

        _loginValidator
            .Setup(v => v.ValidateAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Login = request.Login,
            Password = request.Password,
            Name = "Test",
            Surname = "User",
            Identifier = "000001",
            Role = UserRole.Reader,
            CreatedAt = DateTime.UtcNow
        };

        _usersRepository
            .Setup(r => r.GetByLoginAsync(request.Login))
            .ReturnsAsync(user);

        _tokenFactory
            .Setup(f => f.Create(user.Id, user.Role))
            .Returns("user-jwt-token");

        RefreshToken? capturedToken = null;

        _refreshTokensRepository
            .Setup(r => r.AddAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()))
            .Callback<RefreshToken, CancellationToken>((t, _) => capturedToken = t)
            .Returns(Task.CompletedTask);

        // Act
        var actionResult = await controller.Login(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var response = Assert.IsType<AuthResponse>(okResult.Value);

        Assert.Equal("user-jwt-token", response.AccessToken);
        Assert.False(string.IsNullOrWhiteSpace(response.RefreshToken));
        Assert.Equal(userId, response.UserId);
        Assert.Equal(UserRole.Reader, response.Role);

        _usersRepository.Verify(
            r => r.GetByLoginAsync(request.Login),
            Times.Once);

        _tokenFactory.Verify(
            f => f.Create(user.Id, user.Role),
            Times.Once);

        _refreshTokensRepository.Verify(
            r => r.AddAsync(It.IsAny<RefreshToken>(), It.IsAny<CancellationToken>()),
            Times.Once);

        Assert.NotNull(capturedToken);
        Assert.Equal(userId, capturedToken!.UserId);
        Assert.Equal(response.RefreshToken, capturedToken.Token);
        Assert.True(capturedToken.ExpiresAt > DateTime.UtcNow);
    }
}