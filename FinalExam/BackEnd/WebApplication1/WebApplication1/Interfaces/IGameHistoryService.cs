using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IGameHistoryService
    {
        Task<PaginatedGameHistoryResponse> GetGameHistoryAsync(GameHistoryRequest request);
        Task<PlayerGameHistoryResponse?> GetPlayerHistoryAsync(string playerName);
        Task<GameHistoryResponse?> GetGameSessionDetailAsync(int sessionId);
        Task<GameStatsResponse> GetGameStatsAsync();
        Task<List<string>> GetTopPlayersAsync(int count = 10);
        Task<bool> DeleteGameHistoryAsync(int sessionId);
        Task<List<GameHistoryResponse>> GetRecentGamesAsync(int count = 5);
    }
}
