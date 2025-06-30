using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class CreateGameTemplateRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Author { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int MinRange { get; set; } = 1;

        [Range(1, int.MaxValue)]
        public int MaxRange { get; set; } = 100;

        [Required]
        [MinLength(1)]
        public List<GameRuleRequest> Rules { get; set; } = new();
    }

    public class GameRuleRequest
    {
        [Range(2, int.MaxValue)]
        public int Divisor { get; set; }

        [Required]
        [MaxLength(50)]
        public string Replacement { get; set; } = string.Empty;
    }
}