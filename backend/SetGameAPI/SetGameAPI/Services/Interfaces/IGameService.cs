using SetGameAPI.DTOs.Responses;

namespace SetGameAPI.Services.Interfaces;

public interface IGameService
{
    Task<GameResponse> StartNewGameAsync(int userId);
    Task<GameResponse?> GetGameAsync(int gameID, int userId);
    Task <bool> CheckSetAsync (int gameID, int userId, List<int> cardIDs);
}