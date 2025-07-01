using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class Initial_Create : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GameTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Author = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    MinRange = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    MaxRange = table.Column<int>(type: "integer", nullable: false, defaultValue: 100),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameTemplates", x => x.Id);
                    table.CheckConstraint("CK_GameTemplates_MinRange", "\"MinRange\" >= 1");
                    table.CheckConstraint("CK_GameTemplates_Range", "\"MinRange\" < \"MaxRange\"");
                });

            migrationBuilder.CreateTable(
                name: "GameRules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GameTemplateId = table.Column<int>(type: "integer", nullable: false),
                    Divisor = table.Column<int>(type: "integer", nullable: false),
                    Replacement = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameRules", x => x.Id);
                    table.CheckConstraint("CK_GameRules_Divisor", "\"Divisor\" >= 2");
                    table.ForeignKey(
                        name: "FK_GameRules_GameTemplates",
                        column: x => x.GameTemplateId,
                        principalTable: "GameTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GameSessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GameTemplateId = table.Column<int>(type: "integer", nullable: false),
                    PlayerName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    CorrectAnswers = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    IncorrectAnswers = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameSessions", x => x.Id);
                    table.CheckConstraint("CK_GameSessions_Duration", "\"Duration\" >= 10 AND \"Duration\" <= 300");
                    table.CheckConstraint("CK_GameSessions_Scores", "\"CorrectAnswers\" >= 0 AND \"IncorrectAnswers\" >= 0");
                    table.ForeignKey(
                        name: "FK_GameSessions_GameTemplates",
                        column: x => x.GameTemplateId,
                        principalTable: "GameTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GameAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GameSessionId = table.Column<int>(type: "integer", nullable: false),
                    Number = table.Column<int>(type: "integer", nullable: false),
                    PlayerAnswer = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    CorrectAnswer = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    IsCorrect = table.Column<bool>(type: "boolean", nullable: false),
                    AnsweredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameAnswers", x => x.Id);
                    table.CheckConstraint("CK_GameAnswers_Number", "\"Number\" >= 1");
                    table.ForeignKey(
                        name: "FK_GameAnswers_GameSessions",
                        column: x => x.GameSessionId,
                        principalTable: "GameSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "GameTemplates",
                columns: new[] { "Id", "Author", "CreatedAt", "MaxRange", "MinRange", "Name" },
                values: new object[,]
                {
                    { 1, "System", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 100, 1, "Classic FizzBuzz" },
                    { 2, "Alex", new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), 1000, 1, "FooBooLoo" }
                });

            migrationBuilder.InsertData(
                table: "GameRules",
                columns: new[] { "Id", "Divisor", "GameTemplateId", "Replacement" },
                values: new object[,]
                {
                    { 1, 3, 1, "Fizz" },
                    { 2, 5, 1, "Buzz" },
                    { 3, 7, 2, "Foo" },
                    { 4, 11, 2, "Boo" },
                    { 5, 103, 2, "Loo" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameAnswers_AnsweredAt",
                table: "GameAnswers",
                column: "AnsweredAt");

            migrationBuilder.CreateIndex(
                name: "IX_GameAnswers_GameSessionId",
                table: "GameAnswers",
                column: "GameSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_GameAnswers_GameSessionId_Number_UNIQUE",
                table: "GameAnswers",
                columns: new[] { "GameSessionId", "Number" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameAnswers_IsCorrect",
                table: "GameAnswers",
                column: "IsCorrect");

            migrationBuilder.CreateIndex(
                name: "IX_GameRules_GameTemplateId",
                table: "GameRules",
                column: "GameTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GameRules_GameTemplateId_Divisor",
                table: "GameRules",
                columns: new[] { "GameTemplateId", "Divisor" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_GameTemplateId",
                table: "GameSessions",
                column: "GameTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_IsCompleted",
                table: "GameSessions",
                column: "IsCompleted");

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_PlayerName",
                table: "GameSessions",
                column: "PlayerName");

            migrationBuilder.CreateIndex(
                name: "IX_GameSessions_StartedAt",
                table: "GameSessions",
                column: "StartedAt");

            migrationBuilder.CreateIndex(
                name: "IX_GameTemplates_Author",
                table: "GameTemplates",
                column: "Author");

            migrationBuilder.CreateIndex(
                name: "IX_GameTemplates_CreatedAt",
                table: "GameTemplates",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_GameTemplates_Name",
                table: "GameTemplates",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameAnswers");

            migrationBuilder.DropTable(
                name: "GameRules");

            migrationBuilder.DropTable(
                name: "GameSessions");

            migrationBuilder.DropTable(
                name: "GameTemplates");
        }
    }
}
