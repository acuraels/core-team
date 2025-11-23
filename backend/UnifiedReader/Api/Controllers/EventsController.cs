using System.Security.Claims;
using Api.Controllers.Models.Request;
using Api.Controllers.Models.Response;
using Dal.Models.Events.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// Контроллер действий событий
/// </summary>
[ApiController]
[Route("api/[controller]")]
public sealed class EventsController : ControllerBase
{
    /// <summary>
    /// event repository
    /// </summary>
    private readonly IEventsRepository _eventsRepository;

    public EventsController(IEventsRepository eventsRepository)
    {
        _eventsRepository = eventsRepository;
    }

    /// <summary>
    /// Получить все мероприятия с количеством регистраций и посещений
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<EventResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        var events = await _eventsRepository.GetAllWithStatsAsync(cancellationToken);

        var response = events
            .Select(e => new EventResponse
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                StartAt = e.StartAt,
                EndAt = e.EndAt,
                EventImage = e.EventImage,
                RegistrationsCount = e.RegistrationsCount,
                VisitorsCount = e.VisitorsCount
            })
            .ToArray();

        return Ok(response);
    }

    /// <summary>
    /// Получить одно мероприятие по идентификатору
    /// </summary>
    [HttpGet("{id:long}")]
    public async Task<ActionResult<EventResponse>> GetById(
        long id,
        CancellationToken cancellationToken)
    {
        var ev = await _eventsRepository.GetByIdWithStatsAsync(id, cancellationToken);

        if (ev == null)
        {
            return NotFound($"Мероприятие с идентификатором {id} не найдено");
        }

        var response = new EventResponse
        {
            Id = ev.Id,
            Name = ev.Name,
            Description = ev.Description,
            StartAt = ev.StartAt,
            EndAt = ev.EndAt,
            EventImage = ev.EventImage,
            RegistrationsCount = ev.RegistrationsCount,
            VisitorsCount = ev.VisitorsCount
        };

        return Ok(response);
    }

    /// <summary>
    /// Создать новое мероприятие
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<EventResponse>> Create(
        [FromBody] CreateEventRequest request,
        CancellationToken cancellationToken)
    {
        if (request is null)
        {
            return BadRequest("Тело запроса не может быть пустым");
        }

        // Нужно добавить в IEventsRepository метод CreateAsync
        // с соответствующей реализацией в DAL.
        var createdEvent = await _eventsRepository.CreateAsync(
            request.Name,
            request.Description,
            request.StartAt,
            request.EndAt,
            request.EventImage,
            cancellationToken);

        var response = new EventResponse
        {
            Id = createdEvent.Id,
            Name = createdEvent.Name,
            Description = createdEvent.Description,
            StartAt = createdEvent.StartAt,
            EndAt = createdEvent.EndAt,
            EventImage = createdEvent.EventImage,
            RegistrationsCount = createdEvent.RegistrationsCount,
            VisitorsCount = createdEvent.VisitorsCount
        };

        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    /// <summary>
    /// Создать 5 рандомных мероприятий
    /// </summary>
    [HttpPost("seed-random")]
    [Authorize]
    public async Task<ActionResult<IReadOnlyCollection<EventResponse>>> SeedRandom(
        CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var random = new Random();
        var result = new List<EventResponse>();

        for (var i = 0; i < 5; i++)
        {
            var startAt = now
                .AddDays(random.Next(0, 30))
                .AddHours(random.Next(0, 24));

            var endAt = startAt.AddHours(2);

            var createdEvent = await _eventsRepository.CreateAsync(
                $"Событие {i + 1}",
                $"Описание события {i + 1}",
                startAt,
                endAt,
                null,
                cancellationToken);

            result.Add(new EventResponse
            {
                Id = createdEvent.Id,
                Name = createdEvent.Name,
                Description = createdEvent.Description,
                StartAt = createdEvent.StartAt,
                EndAt = createdEvent.EndAt,
                EventImage = createdEvent.EventImage,
                RegistrationsCount = createdEvent.RegistrationsCount,
                VisitorsCount = createdEvent.VisitorsCount
            });
        }

        return Ok(result);
    }

    /// <summary>
    /// Зарегистрироваться на мероприятие
    /// </summary>
    [HttpPost("{id:long}/register")]
    [Authorize]
    public async Task<ActionResult> Register(
        long id,
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

        var exists = await _eventsRepository.ExistsAsync(id, cancellationToken);

        if (!exists)
        {
            return NotFound($"Мероприятие с идентификатором {id} не найдено");
        }

        await _eventsRepository.RegisterAsync(id, userId, cancellationToken);

        return NoContent();
    }

    /// <summary>
    /// Отметить посещение мероприятия (можно без предварительной регистрации)
    /// </summary>
    [HttpPost("{id:long}/visit")]
    [Authorize]
    public async Task<ActionResult> Visit(
        long id,
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

        var exists = await _eventsRepository.ExistsAsync(id, cancellationToken);

        if (!exists)
        {
            return NotFound($"Мероприятие с идентификатором {id} не найдено");
        }

        await _eventsRepository.MarkVisitedAsync(id, userId, cancellationToken);

        return NoContent();
    }
}