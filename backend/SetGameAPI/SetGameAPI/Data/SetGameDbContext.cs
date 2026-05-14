using Microsoft.EntityFrameworkCore;
using SetGameAPI.Entities;

namespace SetGameAPI.Data;

// EF Core context: maps entities to database tables and configures relationships.
public class SetGameDbContext : DbContext
{
    public SetGameDbContext(DbContextOptions<SetGameDbContext> options) : base(options)
    {
    }

    // Table mappings for the main domain entities.
    public DbSet<User> Users { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Card> Cards { get; set; }
    public DbSet<Set> Sets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // One User can have many Games; Game stores UserId as FK.
        modelBuilder.Entity<Game>()
            .HasOne(g => g.User)
            .WithMany(u => u.Games)
            .HasForeignKey(g => g.UserId);

        // One Game can have many Cards; Card stores GameId as FK.
        modelBuilder.Entity<Card>()
            .HasOne(c => c.Game)
            .WithMany(g => g.Cards)
            .HasForeignKey(c => c.GameId);

        // One Game can have many Sets; Set stores GameId as FK.
        modelBuilder.Entity<Set>()
            .HasOne(s => s.Game)
            .WithMany(g => g.FoundSets)
            .HasForeignKey(s => s.GameId);
    }
}