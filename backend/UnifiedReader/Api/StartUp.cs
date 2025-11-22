using Api.Validation.User;
using Dal;
using InfraLib;
using InfraLib.Auth.JWT;
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
        services.AddJwtAuth(Configuration);
        services.AddAuthorization();
        services.AddControllers();
        services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp", policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });
        services.AddInfrastructure();
        services.AddDal();
        services.AddLogic();
        services.AddUsers();
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
        app.UseCors("AllowReactApp");
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}