using InfraLib.Validation.Options;
using Microsoft.Extensions.Options;

namespace InfraLib.Storage.Minio;

/// <summary>
/// Настройки Minio
/// </summary>
public sealed class MinioOptions : IValidateOptions<MinioOptions>
{
    public string Endpoint { get; init; } = string.Empty;

    public string AccessKey { get; init; } = string.Empty;

    public string SecretKey { get; init; } = string.Empty;

    public string BucketName { get; init; } = string.Empty;

    public bool UseSsl { get; init; }

    public ValidateOptionsResult Validate(string? name, MinioOptions options)
    {
        if (string.IsNullOrWhiteSpace(options.Endpoint))
        {
            return ValidateOptionsResult.Fail("Endpoint Minio не должен быть пустым");
        }

        if (string.IsNullOrWhiteSpace(options.AccessKey))
        {
            return ValidateOptionsResult.Fail("AccessKey Minio не должен быть пустым");
        }

        if (string.IsNullOrWhiteSpace(options.SecretKey))
        {
            return ValidateOptionsResult.Fail("SecretKey Minio не должен быть пустым");
        }

        if (string.IsNullOrWhiteSpace(options.BucketName))
        {
            return ValidateOptionsResult.Fail("BucketName Minio не должен быть пустым");
        }

        return ValidateOptionsResult.Success;
    }
}