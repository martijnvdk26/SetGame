namespace SetGameAPI.DTOs.Responses;

public class CardResponse
{
    public int Id { get; set; }
    public string Color { get; set; }
    public string Number { get; set; }
    public string Shading { get; set; }
    public string Shape { get; set; }
    public bool IsInPlay { get; set; }
    public bool IsMatched { get; set; }
}