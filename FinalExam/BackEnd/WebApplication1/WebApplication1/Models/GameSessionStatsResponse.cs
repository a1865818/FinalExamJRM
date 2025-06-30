namespace WebApplication1.Models
{
    public class GameSessionStatsResponse
    {
        public int SessionId { get; set; }
        public int TotalPossibleNumbers { get; set; }
        public int NumbersUsed { get; set; }
        public int NumbersRemaining { get; set; }
        public List<int> UsedNumbers { get; set; } = new();
        public bool IsCompleted { get; set; }
        public int TimeRemaining { get; set; }
    }
}
