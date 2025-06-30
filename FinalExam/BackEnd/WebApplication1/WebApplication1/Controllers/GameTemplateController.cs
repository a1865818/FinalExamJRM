using Microsoft.AspNetCore.Mvc;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameTemplateController : ControllerBase
    {
        private readonly IGameTemplateService _gameTemplateService;

        public GameTemplateController(IGameTemplateService gameTemplateService)
        {
            _gameTemplateService = gameTemplateService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameTemplateResponse>>> GetAllGameTemplates()
        {
            try
            {
                var templates = await _gameTemplateService.GetAllGameTemplatesAsync();
                return Ok(templates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GameTemplateResponse>> GetGameTemplate(int id)
        {
            try
            {
                var template = await _gameTemplateService.GetGameTemplateByIdAsync(id);

                if (template == null)
                {
                    return NotFound($"Game template with ID {id} not found");
                }

                return Ok(template);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<GameTemplateResponse>> CreateGameTemplate([FromBody] CreateGameTemplateRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var template = await _gameTemplateService.CreateGameTemplateAsync(request);
                return CreatedAtAction(nameof(GetGameTemplate), new { id = template.Id }, template);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
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

        [HttpPut("{id}")]
        public async Task<ActionResult<GameTemplateResponse>> UpdateGameTemplate(int id, [FromBody] CreateGameTemplateRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var template = await _gameTemplateService.UpdateGameTemplateAsync(id, request);

                if (template == null)
                {
                    return NotFound($"Game template with ID {id} not found");
                }

                return Ok(template);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
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

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteGameTemplate(int id)
        {
            try
            {
                var success = await _gameTemplateService.DeleteGameTemplateAsync(id);

                if (!success)
                {
                    return NotFound($"Game template with ID {id} not found");
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
