using SetGameAPI.Entities;

namespace SetGameAPI.Repositories.Interfaces;

public interface IGameRepository
{
    Task<Game?> GetGameByIdAsync(int id);
    Task <Game?> GetActiveGameByUserIdAsync(int userId);
    Task <Game> AddGameAsync(Game game);
    Task UpdateGameAsync(Game game);
}