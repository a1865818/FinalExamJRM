namespace WebApplication1.Entities
{
    public class GameSession
    {
        public int Id { get; set; }
        public int GameTemplateId { get; set; }
        public GameTemplate GameTemplate { get; set; } = null!;
        public string PlayerName { get; set; } = string.Empty;
        public int Duration { get; set; } // in seconds
        public int CorrectAnswers { get; set; } = 0;
        public int IncorrectAnswers { get; set; } = 0;
        public bool IsCompleted { get; set; } = false;
        public DateTime StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public ICollection<GameAnswer> Answers { get; set; } = new List<GameAnswer>();
    }
}
