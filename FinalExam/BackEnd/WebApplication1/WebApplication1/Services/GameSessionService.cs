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

            public GameSessionService(
                ApplicationDbContext context,
                IFizzBuzzEngine fizzBuzzEngine,
                IRandomNumberService randomNumberService)
            {
                _context = context;
                _fizzBuzzEngine = fizzBuzzEngine;
                _randomNumberService = randomNumberService;
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

                // Check if time has expired
                var timeElapsed = DateTime.UtcNow - session.StartedAt;
                if (timeElapsed.TotalSeconds >= session.Duration)
                {
                    await CompleteGameSessionAsync(sessionId, "Time expired");
                    throw new InvalidOperationException("Game session has expired");
                }

                // FIXED: Get ALL used numbers from GameAnswers table for this session
                var usedNumbersList = await _context.GameAnswers
                    .Where(a => a.GameSessionId == sessionId)
                    .Select(a => a.Number)
                    .Distinct() // Ensure no duplicates in the list itself
                    .ToListAsync();

                var usedNumbers = new HashSet<int>(usedNumbersList);

                // Calculate available numbers in the range
                var minRange = session.GameTemplate.MinRange;
                var maxRange = session.GameTemplate.MaxRange;
                var totalPossibleNumbers = maxRange - minRange + 1;

                Console.WriteLine($"Session {sessionId}: Used numbers count: {usedNumbers.Count}, Total possible: {totalPossibleNumbers}");
                Console.WriteLine($"Used numbers: [{string.Join(", ", usedNumbers.OrderBy(n => n))}]");

                // Check if all numbers in the range have been used
                if (usedNumbers.Count >= totalPossibleNumbers)
                {
                    await CompleteGameSessionAsync(sessionId, "All numbers in range have been used");
                    throw new InvalidOperationException("All numbers in the specified range have been used. Game completed!");
                }

                // FIXED: Create list of ALL available numbers (not used yet)
                var availableNumbers = new List<int>();
                for (int i = minRange; i <= maxRange; i++)
                {
                    if (!usedNumbers.Contains(i))
                    {
                        availableNumbers.Add(i);
                    }
                }

                Console.WriteLine($"Available numbers count: {availableNumbers.Count}");
                Console.WriteLine($"Available numbers: [{string.Join(", ", availableNumbers.Take(10))}{(availableNumbers.Count > 10 ? "..." : "")}]");

                if (availableNumbers.Count == 0)
                {
                    await CompleteGameSessionAsync(sessionId, "No available numbers remaining");
                    throw new InvalidOperationException("No available numbers remaining in the specified range. Game completed!");
                }

                // FIXED: Generate random number from ONLY available numbers
                var random = new Random();
                var randomIndex = random.Next(availableNumbers.Count);
                var selectedNumber = availableNumbers[randomIndex];

                Console.WriteLine($"Selected number: {selectedNumber} (index {randomIndex} from {availableNumbers.Count} available)");

                // Double-check that this number hasn't been used (safety check)
                var alreadyUsed = await _context.GameAnswers
                    .AnyAsync(a => a.GameSessionId == sessionId && a.Number == selectedNumber);

                if (alreadyUsed)
                {
                    // This should never happen with the fixed logic, but log it if it does
                    Console.WriteLine($"ERROR: Selected number {selectedNumber} was already used! This should not happen.");
                    throw new InvalidOperationException($"System error: Generated duplicate number {selectedNumber}");
                }

                return new GameQuestionResponse
                {
                    Number = selectedNumber,
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

                // Check if time has expired
                var timeElapsed = DateTime.UtcNow - session.StartedAt;
                if (timeElapsed.TotalSeconds >= session.Duration)
                {
                    await CompleteGameSessionAsync(request.SessionId, "Time expired");
                    throw new InvalidOperationException("Game session has expired");
                }

                // FIXED: Double-check if this number has already been answered (should not happen now)
                var existingAnswer = await _context.GameAnswers
                    .FirstOrDefaultAsync(a => a.GameSessionId == request.SessionId && a.Number == request.Number);

                if (existingAnswer != null)
                {
                    Console.WriteLine($"ERROR: Attempted to submit duplicate number {request.Number} for session {request.SessionId}");
                    throw new InvalidOperationException($"Number {request.Number} has already been answered in this session");
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

                Console.WriteLine($"Answer submitted for number {request.Number}: {(isCorrect ? "Correct" : "Incorrect")}");

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
                return await CompleteGameSessionAsync(sessionId, "Game completed by user");
            }

            private async Task<GameResultResponse?> CompleteGameSessionAsync(int sessionId, string reason)
            {
                var session = await _context.GameSessions
                    .Include(s => s.GameTemplate)
                    .FirstOrDefaultAsync(s => s.Id == sessionId);

                if (session == null)
                {
                    return null;
                }

                // Don't complete if already completed
                if (session.IsCompleted)
                {
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

                session.IsCompleted = true;
                session.CompletedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                Console.WriteLine($"Game session {sessionId} completed. Reason: {reason}");

                var finalTotalQuestions = session.CorrectAnswers + session.IncorrectAnswers;
                var finalAccuracyPercentage = finalTotalQuestions > 0 ? (double)session.CorrectAnswers / finalTotalQuestions * 100 : 0;

                return new GameResultResponse
                {
                    SessionId = session.Id,
                    GameName = session.GameTemplate.Name,
                    PlayerName = session.PlayerName,
                    Duration = session.Duration,
                    CorrectAnswers = session.CorrectAnswers,
                    IncorrectAnswers = session.IncorrectAnswers,
                    TotalQuestions = finalTotalQuestions,
                    AccuracyPercentage = Math.Round(finalAccuracyPercentage, 2),
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
                    .Include(s => s.GameTemplate)
                    .FirstOrDefaultAsync(s => s.Id == sessionId);

                if (session == null || session.IsCompleted)
                {
                    return false;
                }

                // Check time expiration
                var elapsed = DateTime.UtcNow - session.StartedAt;
                if (elapsed.TotalSeconds >= session.Duration)
                {
                    await CompleteGameSessionAsync(sessionId, "Time expired");
                    return false;
                }

                // Check if all numbers have been used
                var usedNumbers = await _context.GameAnswers
                    .Where(a => a.GameSessionId == sessionId)
                    .CountAsync();

                var totalPossibleNumbers = session.GameTemplate.MaxRange - session.GameTemplate.MinRange + 1;

                if (usedNumbers >= totalPossibleNumbers)
                {
                    await CompleteGameSessionAsync(sessionId, "All numbers used");
                    return false;
                }

                return true;
            }

            public async Task<GameSessionStatsResponse> GetSessionStatsAsync(int sessionId)
            {
                var session = await _context.GameSessions
                    .Include(s => s.GameTemplate)
                    .FirstOrDefaultAsync(s => s.Id == sessionId);

                if (session == null)
                {
                    throw new ArgumentException($"Game session with ID {sessionId} not found");
                }

                var usedNumbers = await _context.GameAnswers
                    .Where(a => a.GameSessionId == sessionId)
                    .Select(a => a.Number)
                    .Distinct()
                    .ToListAsync();

                var totalPossibleNumbers = session.GameTemplate.MaxRange - session.GameTemplate.MinRange + 1;
                var remainingNumbers = totalPossibleNumbers - usedNumbers.Count;

                return new GameSessionStatsResponse
                {
                    SessionId = sessionId,
                    TotalPossibleNumbers = totalPossibleNumbers,
                    NumbersUsed = usedNumbers.Count,
                    NumbersRemaining = remainingNumbers,
                    UsedNumbers = usedNumbers.OrderBy(n => n).ToList(),
                    IsCompleted = session.IsCompleted,
                    TimeRemaining = session.IsCompleted ? 0 :
                        Math.Max(0, session.Duration - (int)(DateTime.UtcNow - session.StartedAt).TotalSeconds)
                };
            }
        }
    }
