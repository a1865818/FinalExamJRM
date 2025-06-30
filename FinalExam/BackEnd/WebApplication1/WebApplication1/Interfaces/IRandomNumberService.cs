namespace WebApplication1.Interfaces
{
    public interface IRandomNumberService
    {
        int GenerateRandomNumber(int min, int max, HashSet<int> excludedNumbers);
    }
}
