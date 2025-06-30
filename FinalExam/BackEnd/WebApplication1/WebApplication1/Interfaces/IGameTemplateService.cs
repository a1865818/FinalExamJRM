using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IGameTemplateService
    {
        Task<GameTemplateResponse> CreateGameTemplateAsync(CreateGameTemplateRequest request);
        Task<IEnumerable<GameTemplateResponse>> GetAllGameTemplatesAsync();
        Task<GameTemplateResponse?> GetGameTemplateByIdAsync(int id);
        Task<GameTemplateResponse?> UpdateGameTemplateAsync(int id, CreateGameTemplateRequest request);
        Task<bool> DeleteGameTemplateAsync(int id);
        Task<bool> GameTemplateExistsAsync(string name);
    }
}
