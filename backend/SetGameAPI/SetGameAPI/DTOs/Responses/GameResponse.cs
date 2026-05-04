namespace SetGameAPI.DTOs.Responses;

public class GameResponse
{
    public int Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public List <CardResponse> Cards { get; set; } = new List<CardResponse>();
}