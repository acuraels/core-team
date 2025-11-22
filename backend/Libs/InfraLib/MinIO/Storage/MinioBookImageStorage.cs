using InfraLib.Storage.Minio.interfaces;
using Minio;
using Minio.DataModel.Args;
using Microsoft.Extensions.Options;

namespace InfraLib.Storage.Minio.Storage;

public sealed class MinioBookImageStorage : IBookImageStorage
{
    private readonly IMinioClient _client;
    private readonly MinioOptions _options;

    public MinioBookImageStorage(
        IMinioClient client,
        IOptions<MinioOptions> options)
    {
        _client = client;
        _options = options.Value;
    }

    public async Task<string> UploadAsync(Guid bookId, Stream content, string contentType, CancellationToken cancellationToken)
    {
        var objectName = $"books/{bookId:D}/{Guid.NewGuid():N}";

        var args = new PutObjectArgs()
            .WithBucket(_options.BucketName)
            .WithObject(objectName)
            .WithStreamData(content)
            .WithObjectSize(content.Length)
            .WithContentType(contentType);

        await _client.PutObjectAsync(args, cancellationToken);

        return objectName;
    }
}