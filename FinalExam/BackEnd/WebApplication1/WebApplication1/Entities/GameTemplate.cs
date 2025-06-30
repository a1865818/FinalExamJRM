namespace WebApplication1.Entities
{
    public class GameTemplate
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int MinRange { get; set; } = 1;
        public int MaxRange { get; set; } = 100;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<GameRule> Rules { get; set; } = new List<GameRule>();
    }
}
