using SetGameAPI.DTOs.Responses;

namespace SetGameAPI.Services.Interfaces;

public interface IGameService
{
    Task<GameResponse> StartNewGameAsync(int userId);
    Task<GameResponse?> GetGameAsync(int gameID, int userId);
    Task <GameResponse?> CheckSetAsync (int gameID, int userId, List<int> cardIDs);
    Task<List<GameResponse>> GetGamesAsync(int userId);
}