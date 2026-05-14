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

        for (int i = 0; i < 12 && i < game.Cards.Count; i++)
        {
            game.Cards[i].IsInPlay = true;
        }

        var createdGame = await _gameRepository.AddGameAsync(game);
        return MapToResponse(createdGame);
    }

    public async Task<GameResponse?> GetGameAsync(int gameId, int userId)
    {
        var game = await _gameRepository.GetGameByIdAsync(gameId);

        if (game == null || game.UserId != userId)
            return null;

        return MapToResponse(game);
    }

    public async Task<GameResponse?> CheckSetAsync(int gameId, int userId, List<int> cardIDs)
    {
        if (cardIDs == null || cardIDs.Count != 3) return null;

        var game = await _gameRepository.GetGameByIdAsync(gameId);

        if (game == null || game.UserId != userId) return null;

        var selectedCards = game.Cards.Where(c => cardIDs.Contains(c.Id)).ToList();
        if (selectedCards.Count != 3) return null;

        bool isValidSet = IsValidSet(selectedCards[0], selectedCards[1], selectedCards[2]);

        if (isValidSet)
        {
            foreach (var card in selectedCards)
            {
                card.IsMatched = true;
                card.IsInPlay = false;
            }

            // Registreer de gevonden set
            var foundSet = new Set
            {
                GameId = gameId,
                Card1Id = selectedCards[0].Id,
                Card2Id = selectedCards[1].Id,
                Card3Id = selectedCards[2].Id,
                FoundAt = DateTime.UtcNow
            };

            game.FoundSets.Add(foundSet);
            game.SetsFound++;

            var unplayedCards = game.Cards.Where(c => !c.IsInPlay && !c.IsMatched).ToList();
            int cardsToAdd = Math.Min(3, unplayedCards.Count);

            for (int i = 0; i < cardsToAdd; i++)
            {
                unplayedCards[i].IsInPlay = true;
            }

            var remainingInPlayCards = game.Cards.Where(c => c.IsInPlay).ToList();
            var deckCards = game.Cards.Where(c => !c.IsInPlay && !c.IsMatched).ToList();

            // Check if game is finished
            if (remainingInPlayCards.Count < 12 && deckCards.Count == 0 && !HasValidSetOnBoard(remainingInPlayCards))
            {
                game.Status = GameStatus.Won;
                game.EndTime = DateTime.UtcNow;
            }

            await _gameRepository.UpdateGameAsync(game);
        }

        return MapToResponse(game);
    }

    public async Task<List<GameResponse>> GetGamesAsync(int userId)
    {
        var games = await _gameRepository.GetActiveGameByUserIdAsync(userId);

        return games.Select(MapToResponse).ToList();
    }

    public async Task<GameResponse?> AbandonGameAsync(int gameId, int userId)
    {
        var game = await _gameRepository.GetGameByIdAsync(gameId);

        if (game == null || game.UserId != userId)
            return null;

        game.Status = GameStatus.Abandoned;
        game.EndTime = DateTime.UtcNow;

        await _gameRepository.UpdateGameAsync(game);
        return MapToResponse(game);
    }

    public async Task<GameStatisticsResponse?> GetGameStatisticsAsync(int gameId, int userId)
    {
        var game = await _gameRepository.GetGameByIdAsync(gameId);

        if (game == null || game.UserId != userId)
            return null;

        var setDetailsList = game.FoundSets.Select(s => new SetDetailsResponse
        {
            SetId = s.Id,
            Cards = new List<CardResponse>
            {
                MapCardToResponse(game.Cards.First(c => c.Id == s.Card1Id)),
                MapCardToResponse(game.Cards.First(c => c.Id == s.Card2Id)),
                MapCardToResponse(game.Cards.First(c => c.Id == s.Card3Id))
            },
            FoundAt = s.FoundAt
        }).ToList();

        return new GameStatisticsResponse
        {
            GameId = game.Id,
            Status = game.Status.ToString(),
            SetsFound = game.SetsFound,
            StartTime = game.StartTime,
            EndTime = game.EndTime,
            FoundSets = setDetailsList
        };
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
        return IsValidFeature(c1.Color, c2.Color, c3.Color) &&
               IsValidFeature(c1.Number, c2.Number, c3.Number) &&
               IsValidFeature(c1.Shading, c2.Shading, c3.Shading) &&
               IsValidFeature(c1.Shape, c2.Shape, c3.Shape);
    }

    private bool IsValidFeature<T>(T f1, T f2, T f3)
    {
        bool allSame = f1.Equals(f2) && f2.Equals(f3);
        bool allDifferent = !f1.Equals(f2) && !f1.Equals(f3) && !f2.Equals(f3);

        return allSame || allDifferent;
    }

    private GameResponse MapToResponse(Game game)
    {
        var inPlayCards = game.Cards.Where(c => c.IsInPlay).ToList();
        var deckCards = game.Cards.Where(c => !c.IsInPlay && !c.IsMatched).ToList();

        return new GameResponse
        {
            Id = game.Id,
            Status = game.Status.ToString(),
            Cards = inPlayCards.Select(c => new CardResponse
            {
                Id = c.Id,
                Color = c.Color.ToString(),
                Number = c.Number.ToString(),
                Shading = c.Shading.ToString(),
                Shape = c.Shape.ToString(),
                IsInPlay = c.IsInPlay,
                IsMatched = c.IsMatched
            }).ToList(),
            CardsRemainingInDeck = deckCards.Count,
            StartTime = game.StartTime,
            EndTime = game.EndTime,
            SetsFound = game.SetsFound
        };
    }

    private CardResponse MapCardToResponse(Card card)
    {
        return new CardResponse
        {
            Id = card.Id,
            Color = card.Color.ToString(),
            Number = card.Number.ToString(),
            Shading = card.Shading.ToString(),
            Shape = card.Shape.ToString(),
            IsInPlay = card.IsInPlay,
            IsMatched = card.IsMatched
        };
    }

    private bool HasValidSetOnBoard(List<Card> cardsInPlay)
    {
        for (int i = 0; i < cardsInPlay.Count; i++)
        {
            for (int j = i + 1; j < cardsInPlay.Count; j++)
            {
                for (int k = j + 1; k < cardsInPlay.Count; k++)
                {
                    if (IsValidSet(cardsInPlay[i], cardsInPlay[j], cardsInPlay[k]))
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}