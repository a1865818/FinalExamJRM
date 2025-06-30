using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Entities
{
    public class GameAnswer
    {
        public int Id { get; set; }
        public int GameSessionId { get; set; }
        public GameSession GameSession { get; set; } = null!;
        public int Number { get; set; }
        public string PlayerAnswer { get; set; } = string.Empty;
        public string CorrectAnswer { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;
    }
}
