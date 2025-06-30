using WebApplication1.Entities;

namespace WebApplication1.Interfaces
{
    public interface IFizzBuzzEngine
    {
        string ProcessNumber(int number, IEnumerable<GameRule> rules);
        bool ValidateAnswer(int number, string playerAnswer, IEnumerable<GameRule> rules);
    }
}
