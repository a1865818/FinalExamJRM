namespace WebApplication1.Models
{
    public class GameSessionResponse
    {
        public int SessionId { get; set; }
        public int GameTemplateId { get; set; }
        public string GameName { get; set; } = string.Empty;
        public string PlayerName { get; set; } = string.Empty;
        public int Duration { get; set; }
        public DateTime StartedAt { get; set; }
        public List<GameRuleResponse> Rules { get; set; } = new();
    }
}
