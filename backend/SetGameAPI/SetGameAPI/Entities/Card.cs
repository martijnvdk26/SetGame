using SetGameAPI.Enums;

namespace SetGameAPI.Entities;

public class Card
{
    public int Id { get; set; }
    
    public CardColor Color { get; set; }
    public CardShape Shape { get; set; }
    public CardShading Shading { get; set; }
    public CardNumber Number { get; set; }
    
    public bool IsInPlay { get; set; } = false; // Indicates if the card is currently in play (on the table)
    public bool IsMatched { get; set; } = false;
    
    public int GameId { get; set; }
    public Game? Game { get; set; }
}