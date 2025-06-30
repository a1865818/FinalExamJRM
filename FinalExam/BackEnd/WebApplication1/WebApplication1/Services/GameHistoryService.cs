using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class GameHistoryService : IGameHistoryService
    {
        private readonly ApplicationDbContext _context;

        public GameHistoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedGameHistoryResponse> GetGameHistoryAsync(GameHistoryRequest request)
        {
            var query = _context.GameSessions
                .Include(s => s.GameTemplate)
                .ThenInclude(g => g.Rules)
                .Include(s => s.Answers)
                .Where(s => s.IsCompleted);

            // Apply filters
            if (!string.IsNullOrEmpty(request.PlayerName))
            {
                query = query.Where(s => s.PlayerName.ToLower().Contains(request.PlayerName.ToLower()));
            }

            if (request.GameTemplateId.HasValue)
            {
                query = query.Where(s => s.GameTemplateId == request.GameTemplateId.Value);
            }

            if (request.FromDate.HasValue)
            {
                query = query.Where(s => s.StartedAt >= request.FromDate.Value);
            }

            if (request.ToDate.HasValue)
            {
                query = query.Where(s => s.StartedAt <= request.ToDate.Value);
            }

            // Apply sorting
            query = request.SortBy.ToLower() switch
            {
                "accuracypercentage" => request.SortOrder.ToLower() == "asc"
                    ? query.OrderBy(s => (double)s.CorrectAnswers / (s.CorrectAnswers + s.IncorrectAnswers))
                    : query.OrderByDescending(s => (double)s.CorrectAnswers / (s.CorrectAnswers + s.IncorrectAnswers)),
                "duration" => request.SortOrder.ToLower() == "asc"
                    ? query.OrderBy(s => s.Duration)
                    : query.OrderByDescending(s => s.Duration),
                "playername" => request.SortOrder.ToLower() == "asc"
                    ? query.OrderBy(s => s.PlayerName)
                    : query.OrderByDescending(s => s.PlayerName),
                _ => request.SortOrder.ToLower() == "asc"
                    ? query.OrderBy(s => s.StartedAt)
                    : query.OrderByDescending(s => s.StartedAt)
            };

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            var sessions = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var games = sessions.Select(MapToGameHistoryResponse).ToList();

            return new PaginatedGameHistoryResponse
            {
                Games = games,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalPages = totalPages,
                HasNextPage = request.Page < totalPages,
                HasPreviousPage = request.Page > 1
            };
        }

        public async Task<PlayerGameHistoryResponse?> GetPlayerHistoryAsync(string playerName)
        {
            var sessions = await _context.GameSessions
                .Include(s => s.GameTemplate)
                .ThenInclude(g => g.Rules)
                .Include(s => s.Answers)
                .Where(s => s.PlayerName.ToLower() == playerName.ToLower() && s.IsCompleted)
                .OrderByDescending(s => s.StartedAt)
                .ToListAsync();

            if (!sessions.Any())
            {
                return null;
            }

            var totalCorrect = sessions.Sum(s => s.CorrectAnswers);
            var totalIncorrect = sessions.Sum(s => s.IncorrectAnswers);
            var totalQuestions = totalCorrect + totalIncorrect;
            var overallAccuracy = totalQuestions > 0 ? (double)totalCorrect / totalQuestions * 100 : 0;

            return new PlayerGameHistoryResponse
            {
                PlayerName = playerName,
                TotalGamesPlayed = sessions.Count,
                TotalCorrectAnswers = totalCorrect,
                TotalIncorrectAnswers = totalIncorrect,
                OverallAccuracy = Math.Round(overallAccuracy, 2),
                FirstGamePlayed = sessions.Min(s => s.StartedAt),
                LastGamePlayed = sessions.Max(s => s.StartedAt),
                GameHistory = sessions.Select(MapToGameHistoryResponse).ToList()
            };
        }

        public async Task<GameHistoryResponse?> GetGameSessionDetailAsync(int sessionId)
        {
            var session = await _context.GameSessions
                .Include(s => s.GameTemplate)
                .ThenInclude(g => g.Rules)
                .Include(s => s.Answers)
                .FirstOrDefaultAsync(s => s.Id == sessionId && s.IsCompleted);

            return session != null ? MapToGameHistoryResponse(session) : null;
        }

        public async Task<GameStatsResponse> GetGameStatsAsync()
        {
            var completedSessions = await _context.GameSessions
                .Include(s => s.GameTemplate)
                .Where(s => s.IsCompleted)
                .ToListAsync();

            if (!completedSessions.Any())
            {
                return new GameStatsResponse();
            }

            var totalGames = completedSessions.Count;
            var totalPlayers = completedSessions.Select(s => s.PlayerName.ToLower()).Distinct().Count();

            var totalCorrect = completedSessions.Sum(s => s.CorrectAnswers);
            var totalQuestions = completedSessions.Sum(s => s.CorrectAnswers + s.IncorrectAnswers);
            var averageAccuracy = totalQuestions > 0 ? (double)totalCorrect / totalQuestions * 100 : 0;

            var gameTemplateStats = completedSessions
                .GroupBy(s => s.GameTemplate)
                .Select(g => new GameTemplateStatsResponse
                {
                    GameTemplateId = g.Key.Id,
                    GameName = g.Key.Name,
                    TimesPlayed = g.Count(),
                    AverageAccuracy = g.Sum(s => s.CorrectAnswers + s.IncorrectAnswers) > 0
                        ? Math.Round((double)g.Sum(s => s.CorrectAnswers) / g.Sum(s => s.CorrectAnswers + s.IncorrectAnswers) * 100, 2)
                        : 0,
                    AverageScore = Math.Round(g.Average(s => s.CorrectAnswers), 2)
                })
                .OrderByDescending(s => s.TimesPlayed)
                .ToList();

            return new GameStatsResponse
            {
                TotalGamesPlayed = totalGames,
                TotalPlayersCount = totalPlayers,
                AverageAccuracy = Math.Round(averageAccuracy, 2),
                MostPopularGame = gameTemplateStats.FirstOrDefault() ?? new GameTemplateStatsResponse(),
                GameTemplateStats = gameTemplateStats
            };
        }

        public async Task<List<string>> GetTopPlayersAsync(int count = 10)
        {
            var topPlayers = await _context.GameSessions
                .Where(s => s.IsCompleted)
                .GroupBy(s => s.PlayerName.ToLower())
                .Select(g => new
                {
                    PlayerName = g.First().PlayerName,
                    TotalGames = g.Count(),
                    TotalCorrect = g.Sum(s => s.CorrectAnswers),
                    TotalQuestions = g.Sum(s => s.CorrectAnswers + s.IncorrectAnswers)
                })
                .Where(p => p.TotalQuestions > 0)
                .OrderByDescending(p => (double)p.TotalCorrect / p.TotalQuestions)
                .ThenByDescending(p => p.TotalGames)
                .Take(count)
                .Select(p => p.PlayerName)
                .ToListAsync();

            return topPlayers;
        }

        public async Task<bool> DeleteGameHistoryAsync(int sessionId)
        {
            var session = await _context.GameSessions
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
            {
                return false;
            }

            _context.GameSessions.Remove(session);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<GameHistoryResponse>> GetRecentGamesAsync(int count = 5)
        {
            var recentSessions = await _context.GameSessions
                .Include(s => s.GameTemplate)
                .ThenInclude(g => g.Rules)
                .Include(s => s.Answers)
                .Where(s => s.IsCompleted)
                .OrderByDescending(s => s.CompletedAt)
                .Take(count)
                .ToListAsync();

            return recentSessions.Select(MapToGameHistoryResponse).ToList();
        }

        private static GameHistoryResponse MapToGameHistoryResponse(Entities.GameSession session)
        {
            var totalQuestions = session.CorrectAnswers + session.IncorrectAnswers;
            var accuracyPercentage = totalQuestions > 0 ? (double)session.CorrectAnswers / totalQuestions * 100 : 0;

            return new GameHistoryResponse
            {
                SessionId = session.Id,
                GameName = session.GameTemplate.Name,
                PlayerName = session.PlayerName,
                Duration = session.Duration,
                CorrectAnswers = session.CorrectAnswers,
                IncorrectAnswers = session.IncorrectAnswers,
                TotalQuestions = totalQuestions,
                AccuracyPercentage = Math.Round(accuracyPercentage, 2),
                StartedAt = session.StartedAt,
                CompletedAt = session.CompletedAt ?? session.StartedAt,
                Rules = session.GameTemplate.Rules.Select(r => new GameRuleResponse
                {
                    Divisor = r.Divisor,
                    Replacement = r.Replacement
                }).OrderBy(r => r.Divisor).ToList(),
                Answers = session.Answers.OrderBy(a => a.AnsweredAt).Select(a => new GameAnswerHistoryResponse
                {
                    Number = a.Number,
                    PlayerAnswer = a.PlayerAnswer,
                    CorrectAnswer = a.CorrectAnswer,
                    IsCorrect = a.IsCorrect,
                    AnsweredAt = a.AnsweredAt
                }).ToList()
            };
        }
    }
}
