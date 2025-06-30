using WebApplication1.Interfaces;

namespace WebApplication1.Services
{
    public class RandomNumberService : IRandomNumberService
    {
        private readonly Random _random;

        public RandomNumberService()
        {
            _random = new Random();
        }

        public int GenerateRandomNumber(int min, int max, HashSet<int> excludedNumbers)
        {
            var availableNumbers = new List<int>();

            for (int i = min; i <= max; i++)
            {
                if (!excludedNumbers.Contains(i))
                {
                    availableNumbers.Add(i);
                }
            }

            if (availableNumbers.Count == 0)
            {
                throw new InvalidOperationException("No available numbers to generate");
            }

            var randomIndex = _random.Next(availableNumbers.Count);
            return availableNumbers[randomIndex];
        }
    }
}
