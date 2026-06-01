using SetGameAPI.Enums;

namespace SetGameAPI.Entities;

public class Game
{
    public int Id { get; set; }
    public GameStatus Status { get; set; } = GameStatus.InProgress;
    public DateTime StartTime { get; set; } = DateTime.UtcNow;

    public DateTime? EndTime { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public List<Card> Cards { get; set; } = new List<Card>();

    public int SetsFound { get; set; } = 0;
    public List<Set> FoundSets { get; set; } = new List<Set>();
    public int HintsUsed {get; set;} = 0;
}