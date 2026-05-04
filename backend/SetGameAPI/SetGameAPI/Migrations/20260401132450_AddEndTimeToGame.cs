using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SetGameAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddEndTimeToGame : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EndTime",
                table: "Games",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Games");
        }
    }
}
