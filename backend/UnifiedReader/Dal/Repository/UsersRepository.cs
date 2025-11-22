using Dapper;
using System.Data;
using Dal.Users;

namespace Dal.Repository;

/// <summary>
/// Реализация репозитория пользователей
/// </summary>
public sealed class UsersRepository : IUsersRepository
{
    private readonly IDbConnection _connection;

    public UsersRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<User?> GetByLoginAsync(string login)
    {
        const string sql = "SELECT * FROM users WHERE login = @Login LIMIT 1;";
        if (_connection.State != ConnectionState.Open) _connection.Open();

        return await _connection.QuerySingleOrDefaultAsync<User>(sql, new { Login = login });
    }

    public async Task<User?> GetAsync(Guid id)
    {
        const string sql = "SELECT * FROM users WHERE id = @Id LIMIT 1;";
        if (_connection.State != ConnectionState.Open) _connection.Open();

        return await _connection.QuerySingleOrDefaultAsync<User>(sql, new { Id = id });
    }

    public async Task<IReadOnlyCollection<User>> GetAllAsync()
    {
        const string sql = "SELECT * FROM users;";
        if (_connection.State != ConnectionState.Open) _connection.Open();

        var result = await _connection.QueryAsync<User>(sql);
        return result.ToList();
    }

    public async Task<bool> AnyLibrarianExistsAsync()
    {
        const string sql = "SELECT EXISTS(SELECT 1 FROM users WHERE role = 2 LIMIT 1);";
        if (_connection.State != ConnectionState.Open) _connection.Open();

        return await _connection.QuerySingleAsync<bool>(sql);
    }

    /// <inheritdoc />
    public async Task<Guid> CreateAsync(User user)
    {
        const string sql = @"
INSERT INTO users (id, name, surname, identifier, login, password, role, created_at)
VALUES (@Id, @Name, @Surname, @Identifier, @Login, @Password, @Role, @CreatedAt);
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        var rows = await _connection.ExecuteAsync(sql, new
        {
            user.Id,
            user.Name,
            user.Surname,
            user.Identifier,
            user.Login,
            user.Password,
            Role = (int)user.Role,
            user.CreatedAt
        });

        if (rows is 0)
        {
            throw new InvalidOperationException("Не удалось создать пользователя");
        }

        return user.Id;
    }

    /// <inheritdoc />
    public async Task<bool> UpdateAsync(User user)
    {
        const string sql = @"
UPDATE users
SET name = @Name,
    surname = @Surname,
    login = @Login,
    password = @Password,
    role = @Role
WHERE id = @Id;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        var rows = await _connection.ExecuteAsync(sql, new
        {
            user.Id,
            user.Name,
            user.Surname,
            user.Login,
            user.Password,
            Role = (int)user.Role
        });

        return rows > 0;
    }

    /// <inheritdoc />
    public async Task<bool> DeleteAsync(Guid id)
    {
        const string sql = @"
DELETE FROM users
WHERE id = @Id;
";

        if (_connection.State is not ConnectionState.Open)
        {
            _connection.Open();
        }

        var rows = await _connection.ExecuteAsync(sql, new
        {
            Id = id
        });

        return rows > 0;
    }
}