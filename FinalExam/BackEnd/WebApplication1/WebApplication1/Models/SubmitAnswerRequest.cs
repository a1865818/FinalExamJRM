using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class SubmitAnswerRequest
    {
        [Required]
        public int SessionId { get; set; }

        [Required]
        public int Number { get; set; }

        [Required]
        [MaxLength(200)]
        public string Answer { get; set; } = string.Empty;
    }
}
