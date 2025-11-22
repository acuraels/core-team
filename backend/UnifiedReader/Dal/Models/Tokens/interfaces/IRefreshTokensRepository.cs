namespace Dal.Tokens.interfaces;

public interface IRefreshTokensRepository
{
    Task AddAsync(RefreshToken token, CancellationToken cancellationToken);

    Task<RefreshToken?> GetAsync(string token, CancellationToken cancellationToken);
}