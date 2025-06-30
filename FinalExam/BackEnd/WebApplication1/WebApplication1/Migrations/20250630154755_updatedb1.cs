using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class updatedb1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_GameAnswers_GameSessionId_Number",
                table: "GameAnswers",
                newName: "IX_GameAnswers_GameSessionId_Number_UNIQUE");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_GameAnswers_GameSessionId_Number_UNIQUE",
                table: "GameAnswers",
                newName: "IX_GameAnswers_GameSessionId_Number");
        }
    }
}
