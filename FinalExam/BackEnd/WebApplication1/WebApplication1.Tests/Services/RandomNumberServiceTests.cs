using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using WebApplication1.Services;

namespace WebApplication1.Tests.Services
{
    public class RandomNumberServiceTests
    {
        private readonly RandomNumberService _service;

        public RandomNumberServiceTests()
        {
            _service = new RandomNumberService();
        }

        [Fact]
        public void GenerateRandomNumber_WithValidRange_ShouldReturnNumberInRange()
        {
            // Arrange
            var excludedNumbers = new HashSet<int>();
            var min = 1;
            var max = 10;

            // Act
            var result = _service.GenerateRandomNumber(min, max, excludedNumbers);

            // Assert
            result.Should().BeInRange(min, max);
        }

        [Fact]
        public void GenerateRandomNumber_WithExcludedNumbers_ShouldNotReturnExcludedNumber()
        {
            // Arrange
            var excludedNumbers = new HashSet<int> { 1, 2, 3, 4 };
            var min = 1;
            var max = 5;

            // Act
            var result = _service.GenerateRandomNumber(min, max, excludedNumbers);

            // Assert
            result.Should().Be(5);
            excludedNumbers.Should().NotContain(result);
        }

        [Fact]
        public void GenerateRandomNumber_WithAllNumbersExcluded_ShouldThrowException()
        {
            // Arrange
            var excludedNumbers = new HashSet<int> { 1, 2, 3, 4, 5 };
            var min = 1;
            var max = 5;

            // Act & Assert
            var action = () => _service.GenerateRandomNumber(min, max, excludedNumbers);
            action.Should().Throw<InvalidOperationException>()
                  .WithMessage("No available numbers to generate");
        }
    }
}
