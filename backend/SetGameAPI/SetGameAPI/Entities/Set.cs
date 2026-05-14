namespace SetGameAPI.Entities;

public class Set
{
    public int Id { get; set; }

    public int GameId { get; set; }
    public Game? Game { get; set; }

    public int Card1Id { get; set; }
    public int Card2Id { get; set; }
    public int Card3Id { get; set; }

    public DateTime FoundAt { get; set; } = DateTime.UtcNow;
}