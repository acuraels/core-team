using System.Security.Claims;
using Api.Controllers;
using Api.Controllers.Models.Request;
using Dal.Models.Books;
using Dal.Models.Books.interfaces;
using InfraLib.Storage.Minio.interfaces;
using Logic.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Assert = Xunit.Assert;

namespace Api.Tests;

public sealed class BooksControllerBookTests
    {
        private readonly Mock<IBooksRepository> _booksRepository = new();
        private readonly Mock<IBooksSeedService> _booksSeedService = new();
        private readonly Mock<IBookImageStorage> _bookImageStorage = new();
        private readonly Mock<IBookFavoritesRepository> _bookFavoritesRepository = new();
        private readonly Mock<IBookObjectsRepository> _bookObjectsRepository = new();
        private readonly Mock<IBookingsRepository> _bookingsRepository = new();
        private readonly Mock<IBooksAdminRepository> _booksAdminRepository = new();

        private BooksController CreateController(ClaimsPrincipal user)
        {
            var controller = new BooksController(
                _booksRepository.Object,
                _booksSeedService.Object,
                _bookImageStorage.Object,
                _bookFavoritesRepository.Object,
                _bookObjectsRepository.Object,
                _bookingsRepository.Object,
                _booksAdminRepository.Object);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = user
                }
            };

            return controller;
        }

        private static ClaimsPrincipal CreateUserWithoutNameIdentifier()
        {
            return new ClaimsPrincipal(new ClaimsIdentity());
        }

        private static ClaimsPrincipal CreateUserWithNameIdentifier(string value)
        {
            var identity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, value)
            }, "Test");

            return new ClaimsPrincipal(identity);
        }

        [Fact]
        public async Task Book_NoUserClaim_ReturnsUnauthorized()
        {
            // Arrange
            var user = CreateUserWithoutNameIdentifier();
            var controller = CreateController(user);
            var id = Guid.NewGuid();
            var request = new BookBookingRequest
            {
                BookingEnd = DateTime.Now.AddDays(1)
            };

            // Act
            var result = await controller.Book(id, request, CancellationToken.None);

            // Assert
            var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Пользователь не авторизован", unauthorized.Value);
            _booksRepository.Verify(
                r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()),
                Times.Never);
            _bookingsRepository.Verify(
                r => r.CreateBookingAsync(It.IsAny<long>(), It.IsAny<Guid>(), It.IsAny<DateTime>(), It.IsAny<CancellationToken>()),
                Times.Never);
        }

        [Fact]
        public async Task Book_InvalidUserGuid_ReturnsBadRequest()
        {
            // Arrange
            var user = CreateUserWithNameIdentifier("not-a-guid");
            var controller = CreateController(user);
            var id = Guid.NewGuid();
            var request = new BookBookingRequest
            {
                BookingEnd = DateTime.Now.AddDays(1)
            };

            // Act
            var result = await controller.Book(id, request, CancellationToken.None);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Некорректный идентификатор пользователя", badRequest.Value);
            _booksRepository.Verify(
                r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()),
                Times.Never);
        }

        [Fact]
        public async Task Book_BookingEndNotInFuture_ReturnsBadRequest()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var user = CreateUserWithNameIdentifier(userId.ToString());
            var controller = CreateController(user);
            var id = Guid.NewGuid();
            var request = new BookBookingRequest
            {
                BookingEnd = DateTime.Now.AddMinutes(-1)
            };

            // Act
            var result = await controller.Book(id, request, CancellationToken.None);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Дата окончания брони должна быть в будущем", badRequest.Value);
            _booksRepository.Verify(
                r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()),
                Times.Never);
        }

        [Fact]
        public async Task Book_BookNotFound_ReturnsNotFound()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var user = CreateUserWithNameIdentifier(userId.ToString());
            var controller = CreateController(user);
            var id = Guid.NewGuid();
            var request = new BookBookingRequest
            {
                BookingEnd = DateTime.Now.AddDays(1)
            };

            _booksRepository
                .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
                .ReturnsAsync((ClassBookEntity?)null);

            // Act
            var result = await controller.Book(id, request, CancellationToken.None);

            // Assert
            var notFound = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal($"Книга с идентификатором {id} не найдена", notFound.Value);
            _bookObjectsRepository.Verify(
                r => r.GetFreeObjectIdForClassBookAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()),
                Times.Never);
            _bookingsRepository.Verify(
                r => r.CreateBookingAsync(It.IsAny<long>(), It.IsAny<Guid>(), It.IsAny<DateTime>(), 
                    It.IsAny<CancellationToken>()),
                Times.Never);
        }

        [Fact]
        public async Task Book_NoFreeObjects_ReturnsBadRequest()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var user = CreateUserWithNameIdentifier(userId.ToString());
            var controller = CreateController(user);
            var id = Guid.NewGuid();
            var request = new BookBookingRequest
            {
                BookingEnd = DateTime.Now.AddDays(1)
            };

            var bookEntity = new ClassBookEntity
            {
                Id = id,
                Name = "Test",
                Description = "Test",
                Author = "Author",
                PublishedYear = 2024,
                ImgPath = null,
                Isbn = "1234567890123"
            };

            _booksRepository
                .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(bookEntity);

            _bookObjectsRepository
                .Setup(r => r.GetFreeObjectIdForClassBookAsync(id, It.IsAny<CancellationToken>()))
                .ReturnsAsync((long?)null);

            // Act
            var result = await controller.Book(id, request, CancellationToken.None);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Нет свободных экземпляров книги для бронирования", badRequest.Value);
            _bookingsRepository.Verify(
                r => r.CreateBookingAsync(It.IsAny<long>(), It.IsAny<Guid>(), It.IsAny<DateTime>(), It.IsAny<CancellationToken>()),
                Times.Never);
            _bookObjectsRepository.Verify(
                r => r.MarkAsTakenAsync(It.IsAny<long>(), It.IsAny<CancellationToken>()),
                Times.Never);
        }

        [Fact]
        public async Task Book_SuccessfulBooking_ReturnsNoContent_AndCreatesBooking()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var user = CreateUserWithNameIdentifier(userId.ToString());
            var controller = CreateController(user);
            var id = Guid.NewGuid();
            var bookingEnd = DateTime.Now.AddDays(1);

            var request = new BookBookingRequest
            {
                BookingEnd = bookingEnd
            };

            var bookEntity = new ClassBookEntity
            {
                Id = id,
                Name = "Test",
                Description = "Test",
                Author = "Author",
                PublishedYear = 2024,
                ImgPath = null,
                Isbn = "1234567890123"
            };

            const long freeObjectId = 123L;

            _booksRepository
                .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(bookEntity);

            _bookObjectsRepository
                .Setup(r => r.GetFreeObjectIdForClassBookAsync(id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(freeObjectId);

            _bookingsRepository
                .Setup(r => r.CreateBookingAsync(freeObjectId, userId, bookingEnd, It.IsAny<CancellationToken>()))
                .ReturnsAsync(1L);

            // Act
            var result = await controller.Book(id, request, CancellationToken.None);

            // Assert
            Assert.IsType<NoContentResult>(result);

            _bookingsRepository.Verify(
                r => r.CreateBookingAsync(
                    freeObjectId,
                    userId,
                    bookingEnd,
                    It.IsAny<CancellationToken>()),
                Times.Once);

            _bookObjectsRepository.Verify(
                r => r.MarkAsTakenAsync(
                    freeObjectId,
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }
    }