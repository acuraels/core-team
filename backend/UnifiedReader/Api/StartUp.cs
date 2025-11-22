using InfraLib;
using InfraLib.Swagger;

namespace Api;

public class Startup
{
    public IConfiguration Configuration { get; }
    private IWebHostEnvironment Environment { get; }

    public Startup(IConfiguration configuration, IWebHostEnvironment env)
    {
        Configuration = configuration;
        Environment = env;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddSwaggerDocumentation();
        services.AddAuthentication().AddJwtBearer();
        services.AddAuthorization();
        services.AddControllers();
        services.AddCors();
        services.AddInfrastructure();
    }

    public void Configure(IApplicationBuilder app)
    {
        if (Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwaggerDocumentation();
        }

        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}