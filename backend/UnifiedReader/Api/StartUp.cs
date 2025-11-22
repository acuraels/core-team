using Api.Validation.User;
using Dal;
using InfraLib;
using InfraLib.Auth.JWT;
using InfraLib.Minio;
using InfraLib.Swagger;
using Logic;

namespace Api;

/// <summary>
/// Стартап
/// </summary>
public class Startup
{
    public IConfiguration Configuration { get; }
    private IWebHostEnvironment Environment { get; }

    public Startup(IConfiguration configuration, IWebHostEnvironment env)
    {
        Configuration = configuration;
        Environment = env;
    }

    /// <summary>
    /// Конфигурация сервисов
    /// </summary>
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddSwaggerDocumentation();
        services.AddAuthorization();
        services.AddControllers();


        services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder
                    .SetIsOriginAllowed(_ => true) // Разрешить любые источники
                    .AllowAnyMethod()               // Разрешить любые методы
                    .AllowAnyHeader()               // Разрешить любые заголовки
                    .AllowCredentials();            // Разрешить куки и токены
            });
        });

        services.AddInfrastructure();
        services.AddMinioStorage(Configuration);
        services.AddDal();
        services.AddLogic();
        services.AddUsers();
        services.AddJwtAuth(Configuration);
    }

    /// <summary>
    /// Конфигурация приложения
    /// </summary>
    public void Configure(IApplicationBuilder app)
    {
        if (Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwaggerDocumentation();
        }

        app.UseRouting();
        app.UseCors();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}