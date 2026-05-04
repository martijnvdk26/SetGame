using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SetGameAPI.DTOs.Requests;
using SetGameAPI.Entities;
using SetGameAPI.Repositories.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SetGameAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthController(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthRequest request)
        {
            var existingUser = await _userRepository.GetUserByUsernameAsync(request.Username);
            if (existingUser != null) return BadRequest("Gebruiker bestaat al.");

            var user = new User
            {
                Username = request.Username,
                PasswordHash = request.Password // In een productie-app moet je dit hashen (bijv. met BCrypt)!
            };

            await _userRepository.CreateUserAsync(user);
            return Ok(new { Message = "Gebruiker succesvol geregistreerd." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest request)
        {
            var user = await _userRepository.GetUserByUsernameAsync(request.Username);
            
            // Password check (simpel gehouden voor schoolproject)
            if (user == null || user.PasswordHash != request.Password) 
                return Unauthorized("Ongeldige inloggegevens.");

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });
        }

        private string GenerateJwtToken(User user)
        {
            // Haal de secret key uit appsettings.json
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"] ?? "EenHeleLangeGeheimeSleutelDieMinstens32KaraktersLangIs!"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}