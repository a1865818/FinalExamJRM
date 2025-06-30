using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IGameSessionService
    {
        Task<GameSessionResponse> StartGameAsync(StartGameRequest request);
        Task<GameQuestionResponse> GetNextQuestionAsync(int sessionId);
        Task<SubmitAnswerResponse> SubmitAnswerAsync(SubmitAnswerRequest request);
        Task<GameResultResponse?> CompleteGameAsync(int sessionId);
        Task<GameSessionResponse?> GetGameSessionAsync(int sessionId);
        Task<bool> IsGameSessionActiveAsync(int sessionId);
        Task<GameSessionStatsResponse> GetSessionStatsAsync(int sessionId);

    }
}
