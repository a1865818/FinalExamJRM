namespace WebApplication1.Models
{
    public class SubmitAnswerResponse
    {
        public bool IsCorrect { get; set; }
        public string CorrectAnswer { get; set; } = string.Empty;
        public int CorrectAnswers { get; set; }
        public int IncorrectAnswers { get; set; }
    }
}
