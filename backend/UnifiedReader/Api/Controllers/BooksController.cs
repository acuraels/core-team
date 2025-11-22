using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Api.Controllers.Models.Request;
using Api.Controllers.Models.Response;
using Api.Mapping.Response;
using Dal.Models.Books;
using Dal.Models.Books.interfaces;
using InfraLib.Storage.Minio.interfaces;
using Logic.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// Контроллер книг
/// </summary>
[ApiController]
[Route("api/books")]
[Authorize]
public sealed class BooksController : ControllerBase
{
    private readonly IBooksRepository _booksRepository;
    private readonly IBooksSeedService _booksSeedService;
    private readonly IBookImageStorage _bookImageStorage;
    private readonly IBookFavoritesRepository _bookFavoritesRepository;
    private readonly IBookObjectsRepository _bookObjectsRepository;
    private readonly IBookingsRepository _bookingsRepository;
    private readonly IBooksAdminRepository _booksAdminRepository;

    public BooksController(
        IBooksRepository booksRepository,
        IBooksSeedService booksSeedService,
        IBookImageStorage bookImageStorage,
        IBookFavoritesRepository bookFavoritesRepository,
        IBookObjectsRepository bookObjectsRepository,
        IBookingsRepository bookingsRepository,
        IBooksAdminRepository booksAdminRepository)
    {
        _booksRepository = booksRepository;
        _booksSeedService = booksSeedService;
        _bookImageStorage = bookImageStorage;
        _bookFavoritesRepository = bookFavoritesRepository;
        _bookObjectsRepository = bookObjectsRepository;
        _bookingsRepository = bookingsRepository;
        _booksAdminRepository = booksAdminRepository;
    }

    /// <summary>
    /// Получить все книги
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<BookResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var books = await _booksRepository.GetAllAsync(cancellationToken);
        var response = books.Select(BookMap.MapToBookResponse).ToArray();
        return Ok(response);
    }

    /// <summary>
    /// Получить одну книгу по идентификатору
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BookResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var book = await _booksRepository.GetByIdAsync(id, cancellationToken);

        if (book == null)
        {
            return NotFound($"Книга с идентификатором {id} не найдена");
        }

        return Ok(BookMap.MapToBookResponse(book));
    }

    /// <summary>
    /// Создать книгу
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<BookResponse>> Create(
        [FromBody] CreateBookRequest request,
        CancellationToken cancellationToken)
    {
        var entity = new ClassBookEntity
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            PublishedYear = request.PublishedYear,
            Author = request.Author,
            ImgPath = null,
            Isbn = request.Isbn
        };

        await _booksRepository.CreateAsync(entity, cancellationToken);

        var response = BookMap.MapToBookResponse(entity);

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, response);
    }

    /// <summary>
    /// Обновить книгу
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(
        Guid id,
        [FromBody] UpdateBookRequest request,
        CancellationToken cancellationToken)
    {
        var existing = await _booksRepository.GetByIdAsync(id, cancellationToken);

        if (existing is null)
        {
            return NotFound($"Книга с идентификатором {id} не найдена");
        }

        existing.Name = request.Name;
        existing.Description = request.Description;
        existing.PublishedYear = request.PublishedYear;
        existing.Author = request.Author;
        existing.Isbn = request.Isbn;

        await _booksRepository.UpdateAsync(existing, cancellationToken);

        return NoContent();
    }

    /// <summary>
    /// Удалить книгу
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var existing = await _booksRepository.GetByIdAsync(id, cancellationToken);

        if (existing == null)
        {
            return NotFound($"Книга с идентификатором {id} не найдена");
        }

        await _booksRepository.DeleteAsync(id, cancellationToken);

        return NoContent();
    }

    /// <summary>
    /// Заполнить таблицу 10 рандомными книгами (предварительно очищает таблицу)
    /// </summary>
    [HttpPost("seed-random")]
    public async Task<ActionResult> SeedRandom(CancellationToken cancellationToken)
    {
        await _booksSeedService.SeedRandomBooksAsync(10, cancellationToken);
        return NoContent();
    }

    /// <summary>
    /// Удалить все записи и создать одну книгу
    /// </summary>
    [HttpPost("reset-one")]
    public async Task<ActionResult> ResetOne(
        [FromBody] CreateBookRequest request,
        CancellationToken cancellationToken)
    {
        var entity = new ClassBookEntity
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            PublishedYear = request.PublishedYear,
            Author = request.Author,
            ImgPath = null,
            Isbn = request.Isbn
        };

        await _booksSeedService.ResetWithSingleBookAsync(entity, cancellationToken);

        return NoContent();
    }

    /// <summary>
    /// Загрузить/обновить картинку книги в Minio
    /// </summary>
    [HttpPost("{id:guid}/image")]
    public async Task<ActionResult<BookResponse>> UploadImage(
        Guid id,
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest("Файл изображения не передан");
        }

        var book = await _booksRepository.GetByIdAsync(id, cancellationToken);

        if (book == null)
        {
            return NotFound($"Книга с идентификатором {id} не найдена");
        }

        await using var stream = file.OpenReadStream();

        var objectPath = await _bookImageStorage.UploadAsync(
            id,
            stream,
            file.ContentType,
            cancellationToken);

        book.ImgPath = objectPath;

        await _booksRepository.UpdateAsync(book, cancellationToken);

        return Ok(BookMap.MapToBookResponse(book));
    }

    /// <summary>
    /// Добавить книгу в избранное
    /// </summary>
    [HttpPost("{id:guid}/favorite")]
    public async Task<ActionResult> AddToFavorite(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim))
        {
            return Unauthorized("Пользователь не авторизован");
        }

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return BadRequest("Некорректный идентификатор пользователя");
        }

        var book = await _booksRepository.GetByIdAsync(id, cancellationToken);

        if (book == null)
        {
            return NotFound($"Книга с идентификатором {id} не найдена");
        }

        await _bookFavoritesRepository.AddAsync(userId, id, cancellationToken);

        return NoContent();
    }

    /// <summary>
    /// Удалить книгу из избранного
    /// </summary>
    [HttpDelete("{id:guid}/favorite")]
    [Authorize]
    public async Task<ActionResult> RemoveFromFavorite(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim))
        {
            return Unauthorized("Пользователь не авторизован");
        }

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return BadRequest("Некорректный идентификатор пользователя");
        }

        await _bookFavoritesRepository.RemoveAsync(userId, id, cancellationToken);

        return NoContent();
    }

    /// <summary>
    /// Забронировать книгу
    /// </summary>
    [HttpPost("{id:guid}/booking")]
    public async Task<ActionResult> Book(
        Guid id,
        [FromBody] BookBookingRequest request,
        CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim))
        {
            return Unauthorized("Пользователь не авторизован");
        }

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return BadRequest("Некорректный идентификатор пользователя");
        }

        if (request.BookingEnd <= DateTime.Now)
        {
            return BadRequest("Дата окончания брони должна быть в будущем");
        }

        var book = await _booksRepository.GetByIdAsync(id, cancellationToken);

        if (book == null)
        {
            return NotFound($"Книга с идентификатором {id} не найдена");
        }

        var objectId = await _bookObjectsRepository.GetFreeObjectIdForClassBookAsync(id, cancellationToken);

        if (objectId == null)
        {
            return BadRequest("Нет свободных экземпляров книги для бронирования");
        }

        await _bookingsRepository.CreateBookingAsync(objectId.Value, userId, request.BookingEnd, cancellationToken);
        await _bookObjectsRepository.MarkAsTakenAsync(objectId.Value, cancellationToken);

        return NoContent();
    }
    
    /// <summary>
    /// Удалить все таблицы домена книг
    /// </summary>
    [HttpDelete("tables")]
    public async Task<ActionResult> DropTables(CancellationToken cancellationToken)
    {
        await _booksAdminRepository.DropTablesAsync(cancellationToken);
        return NoContent();
    }
}