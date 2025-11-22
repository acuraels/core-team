using Dal.Users;
using InfraLib.Models;

namespace Logic.Users;

/// <summary>
/// Реализация сервиса создания пользователей
/// </summary>
public sealed class UserCreationService : IUserCreationService
{
    /// <summary>
    /// Идентификатор читательского билета
    /// </summary>
    private readonly IUserIdentifierGenerator _identifierGenerator;
    private readonly IUsersRepository _repository;

    public UserCreationService(
        IUserIdentifierGenerator identifierGenerator,
        IUsersRepository repository)
    {
        _identifierGenerator = identifierGenerator;
        _repository = repository;
    }

    /// <inheritdoc />
    public async Task<User> CreateAsync(
        string name,
        string surname,
        string login,
        string password,
        UserRole role,
        CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = name,
            Surname = surname,
            Identifier = _identifierGenerator.Generate(),
            Login = login,
            Password = password,
            Role = role,
            CreatedAt = now
        };

        await _repository.CreateAsync(user);
        return user;
    }
}