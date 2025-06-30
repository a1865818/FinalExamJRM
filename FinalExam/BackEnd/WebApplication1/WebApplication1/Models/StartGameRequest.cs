using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class StartGameRequest
    {
        [Required]
        public int GameTemplateId { get; set; }

        [Required]
        [MaxLength(100)]
        public string PlayerName { get; set; } = string.Empty;

        [Range(10, 300)] // 10 seconds to 5 minutes
        public int Duration { get; set; } = 60;
    }
}
