using Microsoft.EntityFrameworkCore;
using SetGameAPI.Data;
using SetGameAPI.Entities;
using SetGameAPI.Enums;
using SetGameAPI.Repositories.Interfaces;

namespace SetGameAPI.Repositories
{
    public class GameRepository(SetGameDbContext context) : IGameRepository
    {
        public async Task<Game?> GetGameByIdAsync(int id)
        {
            return await context.Games
                .Include(g => g.Cards)
                .Include(g => g.FoundSets)
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<List<Game>> GetActiveGameByUserIdAsync(int userId)
        {
            return await context.Games
                .Include(g => g.Cards)
                .Where(g => g.UserId == userId)
                .OrderByDescending(g => g.StartTime)
                .ToListAsync();

        }

        public async Task<Game> AddGameAsync(Game game)
        {
            context.Games.Add(game);
            await context.SaveChangesAsync();
            return game;
        }

        public async Task UpdateGameAsync(Game game)
        {
            context.Games.Update(game);
            await context.SaveChangesAsync();
        }
    }
}