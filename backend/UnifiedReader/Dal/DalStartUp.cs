using Dal.Models.Books.interfaces;
using Dal.Models.Events.interfaces;
using Dal.Repository;
using Dal.Repository.Events;
using Dal.Tokens.interfaces;
using Dal.Users;
using Dal.Users.Migrations;
using InfraLib.Database.Migration;
using Microsoft.Extensions.DependencyInjection;

namespace Dal;

public static class DalStartUp
{
    /// <summary>
    /// Подключение Dal
    /// </summary>
    public static IServiceCollection AddDal(this IServiceCollection services)
    {
        services.AddTransient<IUsersRepository, UsersRepository>();
        services.AddScoped<IRefreshTokensRepository, RefreshTokensRepository>();
        services.AddScoped<IBooksAdminRepository, BooksAdminRepository>();
        services.AddTransient<IDatabaseMigration, UsersCreateTableMigration>();
        services.AddTransient<IDatabaseMigration, RefreshTokensCreateTableMigration>();
        services.AddTransient<IDatabaseMigration, BooksCreateTablesMigration>();
        services.AddTransient<IBooksRepository, BooksRepository>();
        services.AddTransient<IBookFavoritesRepository, BookFavoritesRepository>();
        services.AddTransient<IBookObjectsRepository, BookObjectsRepository>();
        services.AddTransient<IBookingsRepository, BookingsRepository>();
        services.AddTransient<IDatabaseMigration, BooksCreateTablesMigration>();
        services.AddTransient<IDatabaseMigration, EventsAlterTablesMigration>();
        services.AddTransient<IDatabaseMigration, AdminCreateTableMigration>();
        services.AddScoped<IEventsRepository, EventsRepository>();
        
        return services;
    }
}
