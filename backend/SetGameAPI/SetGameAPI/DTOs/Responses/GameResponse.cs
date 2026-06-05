namespace SetGameAPI.DTOs.Responses;

public class GameResponse
{
    public int Id { get; set; }
    public string Status { get; set; }
    public List<CardResponse> Cards { get; set; }
    public int CardsRemainingInDeck { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int SetsFound { get; set; }
    
    // Nieuwe property om te tonen hoeveel sets er nu te vinden zijn
    public int PossibleSetsOnBoard { get; set; } 
}