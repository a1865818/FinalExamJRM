using FluentAssertions;
using WebApplication1.Entities;
using WebApplication1.Services;

namespace WebApplication1.Tests.Services
{

        public class FizzBuzzEngineTests
        {
            private readonly FizzBuzzEngine _engine;

            public FizzBuzzEngineTests()
            {
                _engine = new FizzBuzzEngine();
            }

            [Fact]
            public void ProcessNumber_WithClassicFizzBuzzRules_ShouldReturnCorrectResults()
            {
                // Arrange
                var rules = new List<GameRule>
            {
                new GameRule { Divisor = 3, Replacement = "Fizz" },
                new GameRule { Divisor = 5, Replacement = "Buzz" }
            };

                // Act & Assert
                _engine.ProcessNumber(1, rules).Should().Be("1");
                _engine.ProcessNumber(3, rules).Should().Be("Fizz");
                _engine.ProcessNumber(5, rules).Should().Be("Buzz");
                _engine.ProcessNumber(15, rules).Should().Be("FizzBuzz");
                _engine.ProcessNumber(9, rules).Should().Be("Fizz");
                _engine.ProcessNumber(10, rules).Should().Be("Buzz");
            }

            [Fact]
            public void ProcessNumber_WithCustomRules_ShouldReturnCorrectResults()
            {
                // Arrange
                var rules = new List<GameRule>
            {
                new GameRule { Divisor = 7, Replacement = "Foo" },
                new GameRule { Divisor = 11, Replacement = "Boo" },
                new GameRule { Divisor = 13, Replacement = "Loo" }
            };

                // Act & Assert
                _engine.ProcessNumber(7, rules).Should().Be("Foo");
                _engine.ProcessNumber(11, rules).Should().Be("Boo");
                _engine.ProcessNumber(13, rules).Should().Be("Loo");
                _engine.ProcessNumber(77, rules).Should().Be("FooBoo"); // 7 * 11
                _engine.ProcessNumber(1, rules).Should().Be("1");
            }

            [Fact]
            public void ValidateAnswer_WithCorrectAnswer_ShouldReturnTrue()
            {
                // Arrange
                var rules = new List<GameRule>
            {
                new GameRule { Divisor = 3, Replacement = "Fizz" },
                new GameRule { Divisor = 5, Replacement = "Buzz" }
            };

                // Act & Assert
                _engine.ValidateAnswer(15, "FizzBuzz", rules).Should().BeTrue();
                _engine.ValidateAnswer(3, "Fizz", rules).Should().BeTrue();
                _engine.ValidateAnswer(1, "1", rules).Should().BeTrue();
            }

            [Fact]
            public void ValidateAnswer_WithIncorrectAnswer_ShouldReturnFalse()
            {
                // Arrange
                var rules = new List<GameRule>
            {
                new GameRule { Divisor = 3, Replacement = "Fizz" },
                new GameRule { Divisor = 5, Replacement = "Buzz" }
            };

                // Act & Assert
                _engine.ValidateAnswer(15, "Fizz", rules).Should().BeFalse();
                _engine.ValidateAnswer(3, "3", rules).Should().BeFalse();
                _engine.ValidateAnswer(1, "Fizz", rules).Should().BeFalse();
            }

            [Fact]
            public void ValidateAnswer_IsCaseInsensitive()
            {
                // Arrange
                var rules = new List<GameRule>
            {
                new GameRule { Divisor = 3, Replacement = "Fizz" }
            };

                // Act & Assert
                _engine.ValidateAnswer(3, "fizz", rules).Should().BeTrue();
                _engine.ValidateAnswer(3, "FIZZ", rules).Should().BeTrue();
                _engine.ValidateAnswer(3, "FiZz", rules).Should().BeTrue();
            }
        }
    
}