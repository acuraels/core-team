namespace InfraLib.Storage.Minio.interfaces;

/// <summary>
/// Хранение изображений книг
/// </summary>
public interface IBookImageStorage
{
    /// <summary>
    /// Загрузка изображения книги и возврат пути в хранилище
    /// </summary>
    Task<string> UploadAsync(Guid bookId, Stream content, string contentType, CancellationToken cancellationToken);
}
