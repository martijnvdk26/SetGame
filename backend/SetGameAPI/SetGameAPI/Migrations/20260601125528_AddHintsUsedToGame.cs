using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SetGameAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddHintsUsedToGame : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HintsUsed",
                table: "Games",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HintsUsed",
                table: "Games");
        }
    }
}
