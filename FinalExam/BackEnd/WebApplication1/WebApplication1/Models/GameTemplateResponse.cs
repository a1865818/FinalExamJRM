namespace WebApplication1.Models
{
    public class GameTemplateResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int MinRange { get; set; }
        public int MaxRange { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<GameRuleResponse> Rules { get; set; } = new();
    }

    public class GameRuleResponse
    {
        public int Divisor { get; set; }
        public string Replacement { get; set; } = string.Empty;
    }
}
