using Microsoft.EntityFrameworkCore;
using SetGameAPI.Data;
using SetGameAPI.Entities;
using SetGameAPI.Enums;
using SetGameAPI.Repositories.Interfaces;

namespace SetGameAPI.Repositories
{
    public class GameRepository : IGameRepository
    {
        private readonly SetGameDbContext _context;

        public GameRepository(SetGameDbContext context)
        {
            _context = context;
        }

        public async Task<Game?> GetGameByIdAsync(int id)
        {
            return await _context.Games
                .Include(g => g.Cards)
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<Game?> GetActiveGameByUserIdAsync(int userId)
        {
            return await _context.Games
                .Include(g => g.Cards)
                .FirstOrDefaultAsync(g => g.UserId == userId && g.Status == GameStatus.InProgress);
        }

        public async Task<Game> AddGameAsync(Game game)
        {
            _context.Games.Add(game);
            await _context.SaveChangesAsync();
            return game;
        }

        public async Task UpdateGameAsync(Game game)
        {
            _context.Games.Update(game);
            await _context.SaveChangesAsync();
        }
    }
}