using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SetGameAPI.DTOs.Requests;
using SetGameAPI.Services.Interfaces;
using System.Security.Claims;

namespace SetGameAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : ControllerBase
    {
        private readonly IGameService _gameService;

        public GamesController(IGameService gameService)
        {
            _gameService = gameService;
        }

        private int GetUserId()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdString, out var userId) ? userId : 0;
        }

        [HttpPost]
        public async Task<IActionResult> StartGame()
        {
            var userId = GetUserId();
            var response = await _gameService.StartNewGameAsync(userId);
            return CreatedAtAction(nameof(GetGame), new { id = response.Id }, response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGame(int id)
        {
            var userId = GetUserId();
            var response = await _gameService.GetGameAsync(id, userId);

            if (response == null) return NotFound("Spel niet gevonden of behoort niet tot jou.");

            return Ok(response);
        }

        [HttpPost("{id}/check-set")]
        public async Task<IActionResult> CheckSet(int id, [FromBody] CheckSetRequest request)
        {
            var userId = GetUserId();
            var response = await _gameService.CheckSetAsync(id, userId, request.CardIds);

            if (response == null) return NotFound("Spel niet gevonden.");

            return Ok(response);  // Nu hele GameResponse in plaats van { IsValidSet: true/false }
        }

        [HttpGet("ping")]
        [AllowAnonymous]
        public IActionResult Ping()
        {
            return Ok(new { bericht = "Tsjakka! De verbinding tussen Angular en .NET is geslaagd!" });
        }
    }
}