using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Entities;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class GameTemplateService : IGameTemplateService
    {
        private readonly ApplicationDbContext _context;

        public GameTemplateService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GameTemplateResponse> CreateGameTemplateAsync(CreateGameTemplateRequest request)
        {
            if (await GameTemplateExistsAsync(request.Name))
            {
                throw new InvalidOperationException($"Game template with name '{request.Name}' already exists");
            }

            if (request.MinRange >= request.MaxRange)
            {
                throw new ArgumentException("MinRange must be less than MaxRange");
            }

            // Validate that all divisors are within the specified range
            var invalidDivisors = request.Rules.Where(r => r.Divisor < request.MinRange || r.Divisor > request.MaxRange).ToList();
            if (invalidDivisors.Any())
            {
                throw new ArgumentException($"All divisors must be within the range {request.MinRange}-{request.MaxRange}");
            }

            // Validate that there are no duplicate divisors
            var divisors = request.Rules.Select(r => r.Divisor).ToList();
            if (divisors.Count != divisors.Distinct().Count())
            {
                throw new ArgumentException("Duplicate divisors are not allowed");
            }

            var gameTemplate = new GameTemplate
            {
                Name = request.Name,
                Author = request.Author,
                MinRange = request.MinRange,
                MaxRange = request.MaxRange,
                CreatedAt = DateTime.UtcNow
            };

            var rules = request.Rules.Select(r => new GameRule
            {
                Divisor = r.Divisor,
                Replacement = r.Replacement,
                GameTemplate = gameTemplate
            }).ToList();

            gameTemplate.Rules = rules;

            _context.GameTemplates.Add(gameTemplate);
            await _context.SaveChangesAsync();

            return MapToResponse(gameTemplate);
        }

        public async Task<IEnumerable<GameTemplateResponse>> GetAllGameTemplatesAsync()
        {
            var templates = await _context.GameTemplates
                .Include(g => g.Rules)
                .OrderBy(g => g.CreatedAt)
                .ToListAsync();

            return templates.Select(MapToResponse);
        }

        public async Task<GameTemplateResponse?> GetGameTemplateByIdAsync(int id)
        {
            var template = await _context.GameTemplates
                .Include(g => g.Rules)
                .FirstOrDefaultAsync(g => g.Id == id);

            return template != null ? MapToResponse(template) : null;
        }

        public async Task<bool> GameTemplateExistsAsync(string name)
        {
            return await _context.GameTemplates
                .AnyAsync(g => g.Name.ToLower() == name.ToLower());
        }

        public async Task<GameTemplateResponse?> UpdateGameTemplateAsync(int id, CreateGameTemplateRequest request)
        {
            var existingTemplate = await _context.GameTemplates
                .Include(g => g.Rules)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (existingTemplate == null)
            {
                return null;
            }

            // Check if the new name conflicts with another template (excluding current one)
            var nameExists = await _context.GameTemplates
                .AnyAsync(g => g.Id != id && g.Name.ToLower() == request.Name.ToLower());

            if (nameExists)
            {
                throw new InvalidOperationException($"Game template with name '{request.Name}' already exists");
            }

            if (request.MinRange >= request.MaxRange)
            {
                throw new ArgumentException("MinRange must be less than MaxRange");
            }

            // Validate that all divisors are within the specified range
            var invalidDivisors = request.Rules.Where(r => r.Divisor < request.MinRange || r.Divisor > request.MaxRange).ToList();
            if (invalidDivisors.Any())
            {
                throw new ArgumentException($"All divisors must be within the range {request.MinRange}-{request.MaxRange}");
            }

            // Validate that there are no duplicate divisors
            var divisors = request.Rules.Select(r => r.Divisor).ToList();
            if (divisors.Count != divisors.Distinct().Count())
            {
                throw new ArgumentException("Duplicate divisors are not allowed");
            }

            // Update template properties
            existingTemplate.Name = request.Name;
            existingTemplate.Author = request.Author;
            existingTemplate.MinRange = request.MinRange;
            existingTemplate.MaxRange = request.MaxRange;

            // Remove existing rules
            _context.GameRules.RemoveRange(existingTemplate.Rules);

            // Add new rules
            var newRules = request.Rules.Select(r => new GameRule
            {
                Divisor = r.Divisor,
                Replacement = r.Replacement,
                GameTemplateId = existingTemplate.Id
            }).ToList();

            existingTemplate.Rules = newRules;

            await _context.SaveChangesAsync();

            return MapToResponse(existingTemplate);
        }

        public async Task<bool> DeleteGameTemplateAsync(int id)
        {
            var template = await _context.GameTemplates
                .Include(g => g.Rules)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (template == null)
            {
                return false;
            }

            // Check if template is being used in any game sessions
            var hasActiveSessions = await _context.GameSessions
                .AnyAsync(s => s.GameTemplateId == id);

            if (hasActiveSessions)
            {
                throw new InvalidOperationException("Cannot delete game template that has active game sessions");
            }

            // Remove rules first (cascade delete should handle this, but being explicit)
            _context.GameRules.RemoveRange(template.Rules);

            // Remove the template
            _context.GameTemplates.Remove(template);

            await _context.SaveChangesAsync();

            return true;
        }

        private static GameTemplateResponse MapToResponse(GameTemplate template)
        {
            return new GameTemplateResponse
            {
                Id = template.Id,
                Name = template.Name,
                Author = template.Author,
                MinRange = template.MinRange,
                MaxRange = template.MaxRange,
                CreatedAt = template.CreatedAt,
                Rules = template.Rules.Select(r => new GameRuleResponse
                {
                    Divisor = r.Divisor,
                    Replacement = r.Replacement
                }).OrderBy(r => r.Divisor).ToList()
            };
        }
    }

}
