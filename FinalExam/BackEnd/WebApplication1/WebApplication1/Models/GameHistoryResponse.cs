namespace WebApplication1.Models
{
    public class GameHistoryResponse
    {
        public int SessionId { get; set; }
        public string GameName { get; set; } = string.Empty;
        public string PlayerName { get; set; } = string.Empty;
        public int Duration { get; set; }
        public int CorrectAnswers { get; set; }
        public int IncorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
        public double AccuracyPercentage { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime CompletedAt { get; set; }
        public List<GameRuleResponse> Rules { get; set; } = new();
        public List<GameAnswerHistoryResponse> Answers { get; set; } = new();
    }

    public class GameAnswerHistoryResponse
    {
        public int Number { get; set; }
        public string PlayerAnswer { get; set; } = string.Empty;
        public string CorrectAnswer { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public DateTime AnsweredAt { get; set; }
    }

    public class PlayerGameHistoryResponse
    {
        public string PlayerName { get; set; } = string.Empty;
        public int TotalGamesPlayed { get; set; }
        public int TotalCorrectAnswers { get; set; }
        public int TotalIncorrectAnswers { get; set; }
        public double OverallAccuracy { get; set; }
        public DateTime FirstGamePlayed { get; set; }
        public DateTime LastGamePlayed { get; set; }
        public List<GameHistoryResponse> GameHistory { get; set; } = new();
    }

    public class GameHistoryRequest
    {
        public string? PlayerName { get; set; }
        public int? GameTemplateId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "StartedAt"; // StartedAt, AccuracyPercentage, Duration
        public string SortOrder { get; set; } = "desc"; // asc, desc
    }

    public class PaginatedGameHistoryResponse
    {
        public List<GameHistoryResponse> Games { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }

    public class GameStatsResponse
    {
        public int TotalGamesPlayed { get; set; }
        public int TotalPlayersCount { get; set; }
        public double AverageAccuracy { get; set; }
        public GameTemplateStatsResponse MostPopularGame { get; set; } = new();
        public List<GameTemplateStatsResponse> GameTemplateStats { get; set; } = new();
    }

    public class GameTemplateStatsResponse
    {
        public int GameTemplateId { get; set; }
        public string GameName { get; set; } = string.Empty;
        public int TimesPlayed { get; set; }
        public double AverageAccuracy { get; set; }
        public double AverageScore { get; set; }
    }
}
