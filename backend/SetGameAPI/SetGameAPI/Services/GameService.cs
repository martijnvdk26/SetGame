using System.Security.Cryptography.Xml;
using SetGameAPI.DTOs.Responses;
using SetGameAPI.Entities;
using SetGameAPI.Enums;
using SetGameAPI.Repositories.Interfaces;
using SetGameAPI.Services.Interfaces;

namespace SetGameAPI.Services;

public class GameService : IGameService
{
    private readonly IGameRepository _gameRepository;
    
    public GameService(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public async Task<GameResponse> StartNewGameAsync(int userId)
    {
        var game = new Game
        {
            UserId = userId,
            Status = GameStatus.InProgress,
            Cards = GenerateDeck()
        };

        var createdGame = await _gameRepository.AddGameAsync(game);
        return MaptoResponse(createdGame);
    }

    public async Task<GameResponse?> GetGameAsync(int gameId, int userId)
    {
        var game = await _gameRepository.GetGameByIdAsync(gameId);

        if (game == null || game.UserId != userId)
            return null;
        
        return MaptoResponse(game);
    }

    public async Task<bool> CheckSetAsync(int gameId, int userId, List<int> cardIDs)
    {
        if (cardIDs == null || cardIDs.Count != 3) return false;
        
        var game = await _gameRepository.GetGameByIdAsync(gameId);

        if (game == null || game.UserId != userId) return false;
        
        var selectedCards = game.Cards.Where(c => cardIDs.Contains(c.Id)).ToList();
        if (selectedCards.Count != 3) return false;
        
        return IsValidSet (selectedCards [0], selectedCards [1], selectedCards [2]);
    }

    private List<Card> GenerateDeck()
    {
        var deck = new List<Card>();

        foreach (CardColor color in Enum.GetValues(typeof(CardColor)))
        {
            foreach (CardNumber number in Enum.GetValues(typeof(CardNumber)))
            {
                foreach (CardShading shading in Enum.GetValues(typeof(CardShading)))
                {
                    foreach (CardShape shape in Enum.GetValues(typeof(CardShape)))
                    {
                        deck.Add(new Card
                        {
                            Color = color,
                            Number = number,
                            Shading = shading,
                            Shape = shape
                        });
                    }
                }
            }
        }
        
        var rng = new Random();
        return deck.OrderBy(a => rng.Next()).ToList();
    }

    private bool IsValidSet(Card c1, Card c2, Card c3)
    {
        return IsValidFeature (c1.Color, c2.Color, c3.Color) &&
               IsValidFeature (c1.Number, c2.Number, c3.Number) &&
               IsValidFeature (c1.Shading, c2.Shading, c3.Shading) &&
               IsValidFeature (c1.Shape, c2.Shape, c3.Shape);
    }

    private bool IsValidFeature<T>(T f1, T f2, T f3)
    {
        bool allSame = f1.Equals(f2) &&  f3.Equals(f3);
        bool allDifferent = !f1.Equals(f2) && !f1.Equals(f3) &&  !f2.Equals(f3);
        
        return allSame || allDifferent;
    }

    private GameResponse MaptoResponse(Game game)
    {
        return new GameResponse
        {
            Id = game.Id,
            Status = game.Status.ToString(),
            Cards = game.Cards.Select(c => new CardResponse
            {
                Id = c.Id,
                Color = c.Color.ToString(),
                Number = c.Number.ToString(),
                Shading = c.Shading.ToString(),
                Shape = c.Shape.ToString()
            }).ToList()
        };
    }
}