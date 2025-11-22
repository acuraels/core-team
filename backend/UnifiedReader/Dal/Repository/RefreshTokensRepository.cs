using Dapper;
using Dal.Tokens;
using Dal.Tokens.interfaces;
using System.Data;
using System.Threading;
using System.Threading.Tasks;

namespace Dal.Repository;

public sealed class RefreshTokensRepository : IRefreshTokensRepository
{
    private readonly IDbConnection _connection;

    public RefreshTokensRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    private void EnsureOpen()
    {
        if (_connection.State != ConnectionState.Open)
        {
            _connection.Open();
        }
    }

    public async Task AddAsync(RefreshToken token, CancellationToken cancellationToken)
    {
        EnsureOpen();

        const string sql = @"
INSERT INTO refresh_tokens (id, user_id, token, expires_at)
VALUES (@Id, @UserId, @Token, @ExpiresAt);
";

        await _connection.ExecuteAsync(new CommandDefinition(
            sql,
            token,
            cancellationToken: cancellationToken));
    }

    public async Task<RefreshToken?> GetAsync(string token, CancellationToken cancellationToken)
    {
        EnsureOpen();

        const string sql = @"
SELECT
    id,
    user_id AS UserId,
    token,
    expires_at AS ExpiresAt
FROM refresh_tokens
WHERE token = @Token
LIMIT 1;
";

        var result = await _connection.QuerySingleOrDefaultAsync<RefreshToken>(
            new CommandDefinition(
                sql,
                new { Token = token },
                cancellationToken: cancellationToken));

        return result;
    }
}
