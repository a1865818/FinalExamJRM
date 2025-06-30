using WebApplication1.Entities;
using WebApplication1.Interfaces;

namespace WebApplication1.Services
{
    public class FizzBuzzEngine : IFizzBuzzEngine
    {
        public string ProcessNumber(int number, IEnumerable<GameRule> rules)
        {
            var result = string.Empty;
            var sortedRules = rules.OrderBy(r => r.Divisor);

            foreach (var rule in sortedRules)
            {
                if (number % rule.Divisor == 0)
                {
                    result += rule.Replacement;
                }
            }

            return string.IsNullOrEmpty(result) ? number.ToString() : result;
        }

        public bool ValidateAnswer(int number, string playerAnswer, IEnumerable<GameRule> rules)
        {
            var correctAnswer = ProcessNumber(number, rules);
            return string.Equals(playerAnswer.Trim(), correctAnswer, StringComparison.OrdinalIgnoreCase);
        }
    }
}
