using InfraLib.Storage.Minio;
using InfraLib.Storage.Minio.interfaces;
using InfraLib.Storage.Minio.Storage;
using InfraLib.Validation.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Minio;

namespace InfraLib.Minio;

public static class MinioStartUp
{
    public static IServiceCollection AddMinioStorage(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<MinioOptions>()
            .BindConfiguration(configSectionPath: nameof(MinioOptions))
            .UseValidationOptions()
            .ValidateOnStart();

        services.AddSingleton<IMinioClient>(sp =>
        {
            var options = sp.GetRequiredService<IOptions<MinioOptions>>().Value;

            var client = new MinioClient()
                .WithEndpoint(options.Endpoint)
                .WithCredentials(options.AccessKey, options.SecretKey);

            if (options.UseSsl)
            {
                client = client.WithSSL();
            }

            return client.Build();
        });

        services.AddSingleton<IBookImageStorage, MinioBookImageStorage>();

        return services;
    }
}