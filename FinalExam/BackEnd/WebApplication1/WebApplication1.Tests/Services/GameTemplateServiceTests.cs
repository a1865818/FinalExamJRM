
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Services;
// In memory database provider for testing
using Microsoft.EntityFrameworkCore.InMemory;



namespace WebApplication1.Tests.Services
{
    public class GameTemplateServiceTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly GameTemplateService _service;

        public GameTemplateServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _service = new GameTemplateService(_context);
        }

        [Fact]
        public async Task CreateGameTemplateAsync_WithValidRequest_ShouldReturnGameTemplate()
        {
            // Arrange
            var request = new CreateGameTemplateRequest
            {
                Name = "Test Game",
                Author = "Test Author",
                MinRange = 1,
                MaxRange = 100,
                Rules = new List<GameRuleRequest>
                {
                    new GameRuleRequest { Divisor = 3, Replacement = "Fizz" },
                    new GameRuleRequest { Divisor = 5, Replacement = "Buzz" }
                }
            };

            // Act
            var result = await _service.CreateGameTemplateAsync(request);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be(request.Name);
            result.Author.Should().Be(request.Author);
            result.Rules.Should().HaveCount(2);
        }

        [Fact]
        public async Task CreateGameTemplateAsync_WithDuplicateName_ShouldThrowException()
        {
            // Arrange
            var request1 = new CreateGameTemplateRequest
            {
                Name = "Duplicate Game",
                Author = "Author 1",
                MinRange = 1,
                MaxRange = 100,
                Rules = new List<GameRuleRequest>
                {
                    new GameRuleRequest { Divisor = 3, Replacement = "Fizz" }
                }
            };

            var request2 = new CreateGameTemplateRequest
            {
                Name = "Duplicate Game",
                Author = "Author 2",
                MinRange = 1,
                MaxRange = 100,
                Rules = new List<GameRuleRequest>
                {
                    new GameRuleRequest { Divisor = 7, Replacement = "Foo" }
                }
            };

            // Act
            await _service.CreateGameTemplateAsync(request1);

            // Assert
            var action = async () => await _service.CreateGameTemplateAsync(request2);
            await action.Should().ThrowAsync<InvalidOperationException>()
                        .WithMessage("*already exists*");
        }

        [Fact]
        public async Task CreateGameTemplateAsync_WithInvalidRange_ShouldThrowException()
        {
            // Arrange
            var request = new CreateGameTemplateRequest
            {
                Name = "Invalid Range Game",
                Author = "Test Author",
                MinRange = 100,
                MaxRange = 50,
                Rules = new List<GameRuleRequest>
                {
                    new GameRuleRequest { Divisor = 3, Replacement = "Fizz" }
                }
            };

            // Act & Assert
            var action = async () => await _service.CreateGameTemplateAsync(request);
            await action.Should().ThrowAsync<ArgumentException>()
                        .WithMessage("MinRange must be less than MaxRange");
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
