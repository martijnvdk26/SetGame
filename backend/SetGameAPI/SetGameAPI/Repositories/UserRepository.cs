using Microsoft.EntityFrameworkCore;
using SetGameAPI.Data;
using SetGameAPI.Entities;
using SetGameAPI.Repositories.Interfaces;

namespace SetGameAPI.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly SetGameDbContext _context;

        public UserRepository(SetGameDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}