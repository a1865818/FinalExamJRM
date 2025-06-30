using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameSessionController : ControllerBase
    {
        private readonly IGameSessionService _gameSessionService;

        public GameSessionController(IGameSessionService gameSessionService)
        {
            _gameSessionService = gameSessionService;
        }

        [HttpPost("start")]
        public async Task<ActionResult<GameSessionResponse>> StartGame([FromBody] StartGameRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var session = await _gameSessionService.StartGameAsync(request);
                return Ok(session);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{sessionId}")]
        public async Task<ActionResult<GameSessionResponse>> GetGameSession(int sessionId)
        {
            try
            {
                var session = await _gameSessionService.GetGameSessionAsync(sessionId);

                if (session == null)
                {
                    return NotFound($"Game session with ID {sessionId} not found");
                }

                return Ok(session);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{sessionId}/question")]
        public async Task<ActionResult<GameQuestionResponse>> GetNextQuestion(int sessionId)
        {
            try
            {
                var isActive = await _gameSessionService.IsGameSessionActiveAsync(sessionId);
                if (!isActive)
                {
                    return BadRequest("Game session is not active or has expired");
                }

                var question = await _gameSessionService.GetNextQuestionAsync(sessionId);
                return Ok(question);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("answer")]
        public async Task<ActionResult<SubmitAnswerResponse>> SubmitAnswer([FromBody] SubmitAnswerRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _gameSessionService.SubmitAnswerAsync(request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("{sessionId}/complete")]
        public async Task<ActionResult<GameResultResponse>> CompleteGame(int sessionId)
        {
            try
            {
                var result = await _gameSessionService.CompleteGameAsync(sessionId);

                if (result == null)
                {
                    return NotFound($"Game session with ID {sessionId} not found");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{sessionId}/status")]
        public async Task<ActionResult<bool>> CheckGameStatus(int sessionId)
        {
            try
            {
                var isActive = await _gameSessionService.IsGameSessionActiveAsync(sessionId);
                return Ok(isActive);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
