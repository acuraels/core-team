namespace Dal.Tokens.interfaces;

/// <summary>
/// Репозиторий для работы с токенами обновления
/// </summary>
public interface IRefreshTokensRepository
{
    /// <summary>
    /// Добавить токен обновления
    /// </summary>
    Task AddAsync(RefreshToken token, CancellationToken cancellationToken);

    /// <summary>
    /// Получить токен обновления по значению
    /// </summary>
    Task<RefreshToken?> GetAsync(string token, CancellationToken cancellationToken);
}