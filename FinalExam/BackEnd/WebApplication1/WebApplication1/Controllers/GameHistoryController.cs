using Microsoft.AspNetCore.Mvc;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameHistoryController : ControllerBase
    {
        private readonly IGameHistoryService _gameHistoryService;

        public GameHistoryController(IGameHistoryService gameHistoryService)
        {
            _gameHistoryService = gameHistoryService;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedGameHistoryResponse>> GetGameHistory([FromQuery] GameHistoryRequest request)
        {
            try
            {
                var history = await _gameHistoryService.GetGameHistoryAsync(request);
                return Ok(history);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("player/{playerName}")]
        public async Task<ActionResult<PlayerGameHistoryResponse>> GetPlayerHistory(string playerName)
        {
            try
            {
                var playerHistory = await _gameHistoryService.GetPlayerHistoryAsync(playerName);

                if (playerHistory == null)
                {
                    return NotFound($"No game history found for player '{playerName}'");
                }

                return Ok(playerHistory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("session/{sessionId}")]
        public async Task<ActionResult<GameHistoryResponse>> GetGameSessionDetail(int sessionId)
        {
            try
            {
                var sessionDetail = await _gameHistoryService.GetGameSessionDetailAsync(sessionId);

                if (sessionDetail == null)
                {
                    return NotFound($"Game session with ID {sessionId} not found or not completed");
                }

                return Ok(sessionDetail);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("stats")]
        public async Task<ActionResult<GameStatsResponse>> GetGameStats()
        {
            try
            {
                var stats = await _gameHistoryService.GetGameStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("top-players")]
        public async Task<ActionResult<List<string>>> GetTopPlayers([FromQuery] int count = 10)
        {
            try
            {
                var topPlayers = await _gameHistoryService.GetTopPlayersAsync(count);
                return Ok(topPlayers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("recent")]
        public async Task<ActionResult<List<GameHistoryResponse>>> GetRecentGames([FromQuery] int count = 5)
        {
            try
            {
                var recentGames = await _gameHistoryService.GetRecentGamesAsync(count);
                return Ok(recentGames);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{sessionId}")]
        public async Task<IActionResult> DeleteGameHistory(int sessionId)
        {
            try
            {
                var deleted = await _gameHistoryService.DeleteGameHistoryAsync(sessionId);

                if (!deleted)
                {
                    return NotFound($"Game session with ID {sessionId} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
