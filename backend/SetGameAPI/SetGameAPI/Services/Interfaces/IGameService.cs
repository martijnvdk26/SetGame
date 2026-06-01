using SetGameAPI.DTOs.Responses;

namespace SetGameAPI.Services.Interfaces;

public interface IGameService
{
    Task<GameResponse> StartNewGameAsync(int userId);
    Task<GameResponse?> GetGameAsync(int gameID, int userId);
    Task<GameResponse?> CheckSetAsync(int gameID, int userId, List<int> cardIDs);
    Task<List<GameResponse>> GetGamesAsync(int userId);
    Task<GameResponse?> AbandonGameAsync(int gameId, int userId);
    Task<GameStatisticsResponse?> GetGameStatisticsAsync(int gameId, int userId);
    Task <List<int>?> GetHintAsync (int gameId, int userId);
}