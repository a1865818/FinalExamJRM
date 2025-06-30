namespace WebApplication1.Models
{
    public class GameResultResponse
    {
        public int SessionId { get; set; }
        public string GameName { get; set; } = string.Empty;
        public string PlayerName { get; set; } = string.Empty;
        public int Duration { get; set; }
        public int CorrectAnswers { get; set; }
        public int IncorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public double AccuracyPercentage { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime CompletedAt { get; set; }
    }
}
