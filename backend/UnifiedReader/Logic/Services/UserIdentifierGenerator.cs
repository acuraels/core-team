namespace Logic.Users;

/// <summary>
/// Генератор 6-значного идентификатора пользователя
/// </summary>
public sealed class UserIdentifierGenerator : IUserIdentifierGenerator
{
    /// <summary>
    /// random
    /// </summary>
    private readonly Random _random = new Random();

    /// <inheritdoc />
    public string Generate()
    {
        var number = _random.Next(0, 1_000_000);
        return number.ToString("D6");
    }
}