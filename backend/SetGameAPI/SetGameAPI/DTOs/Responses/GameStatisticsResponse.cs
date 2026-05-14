namespace SetGameAPI.DTOs.Responses;

public class GameStatisticsResponse
{
    public int GameId { get; set; }
    public string Status { get; set; }
    public int SetsFound { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public List<SetDetailsResponse> FoundSets { get; set; } = new();
}

public class SetDetailsResponse
{
    public int SetId { get; set; }
    public List<CardResponse> Cards { get; set; } = new();
    public DateTime FoundAt { get; set; }
}