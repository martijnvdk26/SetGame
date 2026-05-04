namespace SetGameAPI.DTOs.Requests;

public class CheckSetRequest
{
    public List<int> CardIds { get; set; } = new List<int>();
}