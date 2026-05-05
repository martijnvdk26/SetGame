using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SetGameAPI.Data;
using SetGameAPI.Repositories;
using SetGameAPI.Repositories.Interfaces;
using SetGameAPI.Services;
using SetGameAPI.Services.Interfaces;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        var origins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

        if (origins != null && origins.Length > 0)
        {
            policy.WithOrigins(origins)
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
        else
        {
            policy.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
    });
});

// Database Configuratie
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<SetGameDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Dependency Injection voor Repositories en Services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IGameRepository, GameRepository>();
builder.Services.AddScoped<IGameService, GameService>(); // <-- Service toegevoegd!

// JWT Authenticatie Configuratie
var jwtSecret = builder.Configuration["JwtSettings:SecretKey"] ?? "FallbackSecretKeyDieLangerIsDan32Karakters!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();