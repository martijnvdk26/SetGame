namespace SetGameAPI.DTOs.Responses;

public class CardResponse
{
    public int Id { get; set; }
    public string Color { get; set; } =  string.Empty;
    public string Number { get; set; } = string.Empty;
    public string Shading { get; set; } = string.Empty;
    public string Shape { get; set; } = string.Empty;
}