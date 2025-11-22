using Api.Controllers.Models.Response;
using Dal.Models.Books;

namespace Api.Mapping.Response;

internal class BookMap
{
    internal static BookResponse MapToBookResponse(ClassBookEntity entity)
    {
        return new BookResponse
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            PublishedYear = entity.PublishedYear,
            Author = entity.Author,
            ImgPath = entity.ImgPath,
            Isbn = entity.Isbn
        };
    }
}