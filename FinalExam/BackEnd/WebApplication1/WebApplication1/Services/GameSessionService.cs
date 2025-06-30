using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Entities;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class GameSessionService : IGameSessionService
    {
        private readonly ApplicationDbContext _context;
        private readonly IFizzBuzzEngine _fizzBuzzEngine;
        private readonly IRandomNumberService _randomNumberService;
        private readonly Dictionary<int, HashSet<int>> _sessionUsedNumbers;

        public GameSessionService(
            ApplicationDbContext context,
            IFizzBuzzEngine fizzBuzzEngine,
            IRandomNumberService randomNumberService)
        {
            _context = context;
            _fizzBuzzEngine = fizzBuzzEngine;
            _randomNumberService = randomNumberService;
            _sessionUsedNumbers = new Dictionary<int, HashSet<int>>();
        }

        public async Task<GameSessionResponse> StartGameAsync(StartGameRequest request)
        {
            var gameTemplate = await _context.GameTemplates
                .Include(g => g.Rules)
                .FirstOrDefaultAsync(g => g.Id == request.GameTemplateId);

            if (gameTemplate == null)
            {
                throw new ArgumentException($"Game template with ID {request.GameTemplateId} not found");
            }

            var session = new GameSession
            {
                GameTemplateId = request.GameTemplateId,
                PlayerName = request.PlayerName,
                Duration = request.Duration,
                StartedAt = DateTime.UtcNow
            };

            _context.GameSessions.Add(session);
            await _context.SaveChangesAsync();

            _sessionUsedNumbers[session.Id] = new HashSet<int>();

            return new GameSessionResponse
            {
                SessionId = session.Id,
                GameTemplateId = gameTemplate.Id,
                GameName = gameTemplate.Name,
                PlayerName = session.PlayerName,
                Duration = session.Duration,
                StartedAt = session.StartedAt,
                Rules = gameTemplate.Rules.Select(r => new GameRuleResponse
                {
                    Divisor = r.Divisor,
                    Replacement = r.Replacement
                }).OrderBy(r => r.Divisor).ToList()
            };
        }

        public async Task<GameQuestionResponse> GetNextQuestionAsync(int sessionId)
        {
            var session = await _context.GameSessions
                .Include(s => s.GameTemplate)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
            {
                throw new ArgumentException($"Game session with ID {sessionId} not found");
            }

            if (session.IsCompleted)
            {
                throw new InvalidOperationException("Game session is already completed");
            }

            if (!_sessionUsedNumbers.ContainsKey(sessionId))
            {
                _sessionUsedNumbers[sessionId] = new HashSet<int>();
            }

            var usedNumbers = _sessionUsedNumbers[sessionId];
            var randomNumber = _randomNumberService.GenerateRandomNumber(
                session.GameTemplate.MinRange,
                session.GameTemplate.MaxRange,
                usedNumbers);

            usedNumbers.Add(randomNumber);

            return new GameQuestionResponse
            {
                Number = randomNumber,
                TimeStamp = DateTime.UtcNow
            };
        }

        public async Task<SubmitAnswerResponse> SubmitAnswerAsync(SubmitAnswerRequest request)
        {
            var session = await _context.GameSessions
                .Include(s => s.GameTemplate)
                .ThenInclude(g => g.Rules)
                .FirstOrDefaultAsync(s => s.Id == request.SessionId);

            if (session == null)
            {
                throw new ArgumentException($"Game session with ID {request.SessionId} not found");
            }

            if (session.IsCompleted)
            {
                throw new InvalidOperationException("Game session is already completed");
            }

            var correctAnswer = _fizzBuzzEngine.ProcessNumber(request.Number, session.GameTemplate.Rules);
            var isCorrect = _fizzBuzzEngine.ValidateAnswer(request.Number, request.Answer, session.GameTemplate.Rules);

            var gameAnswer = new GameAnswer
            {
                GameSessionId = request.SessionId,
                Number = request.Number,
                PlayerAnswer = request.Answer,
                CorrectAnswer = correctAnswer,
                IsCorrect = isCorrect,
                AnsweredAt = DateTime.UtcNow
            };

            _context.GameAnswers.Add(gameAnswer);

            if (isCorrect)
            {
                session.CorrectAnswers++;
            }
            else
            {
                session.IncorrectAnswers++;
            }

            await _context.SaveChangesAsync();

            return new SubmitAnswerResponse
            {
                IsCorrect = isCorrect,
                CorrectAnswer = correctAnswer,
                CorrectAnswers = session.CorrectAnswers,
                IncorrectAnswers = session.IncorrectAnswers
            };
        }

        public async Task<GameResultResponse?> CompleteGameAsync(int sessionId)
        {
            var session = await _context.GameSessions
                .Include(s => s.GameTemplate)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
            {
                return null;
            }

            session.IsCompleted = true;
            session.CompletedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _sessionUsedNumbers.Remove(sessionId);

            var totalQuestions = session.CorrectAnswers + session.IncorrectAnswers;
            var accuracyPercentage = totalQuestions > 0 ? (double)session.CorrectAnswers / totalQuestions * 100 : 0;

            return new GameResultResponse
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
                CompletedAt = session.CompletedAt ?? DateTime.UtcNow
            };
        }

        public async Task<GameSessionResponse?> GetGameSessionAsync(int sessionId)
        {
            var session = await _context.GameSessions
                .Include(s => s.GameTemplate)
                .ThenInclude(g => g.Rules)
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
            {
                return null;
            }

            return new GameSessionResponse
            {
                SessionId = session.Id,
                GameTemplateId = session.GameTemplate.Id,
                GameName = session.GameTemplate.Name,
                PlayerName = session.PlayerName,
                Duration = session.Duration,
                StartedAt = session.StartedAt,
                Rules = session.GameTemplate.Rules.Select(r => new GameRuleResponse
                {
                    Divisor = r.Divisor,
                    Replacement = r.Replacement
                }).OrderBy(r => r.Divisor).ToList()
            };
        }

        public async Task<bool> IsGameSessionActiveAsync(int sessionId)
        {
            var session = await _context.GameSessions
                .FirstOrDefaultAsync(s => s.Id == sessionId);

            if (session == null)
            {
                return false;
            }

            var elapsed = DateTime.UtcNow - session.StartedAt;
            return !session.IsCompleted && elapsed.TotalSeconds < session.Duration;
        }
    }
}
