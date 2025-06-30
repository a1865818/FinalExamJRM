namespace WebApplication1.Entities
{
    public class GameRule
    {
        public int Id { get; set; }
        public int GameTemplateId { get; set; }
        public GameTemplate GameTemplate { get; set; } = null!;
        public int Divisor { get; set; }
        public string Replacement { get; set; } = string.Empty;
    }
}
