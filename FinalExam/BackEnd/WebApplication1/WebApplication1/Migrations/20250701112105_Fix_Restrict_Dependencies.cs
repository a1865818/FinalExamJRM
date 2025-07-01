using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class Fix_Restrict_Dependencies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameSessions_GameTemplates",
                table: "GameSessions");

            migrationBuilder.AddForeignKey(
                name: "FK_GameSessions_GameTemplates",
                table: "GameSessions",
                column: "GameTemplateId",
                principalTable: "GameTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameSessions_GameTemplates",
                table: "GameSessions");

            migrationBuilder.AddForeignKey(
                name: "FK_GameSessions_GameTemplates",
                table: "GameSessions",
                column: "GameTemplateId",
                principalTable: "GameTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
