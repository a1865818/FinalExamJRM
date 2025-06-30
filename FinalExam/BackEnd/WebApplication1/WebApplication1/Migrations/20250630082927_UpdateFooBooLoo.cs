using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFooBooLoo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "GameTemplates",
                columns: new[] { "Id", "Author", "CreatedAt", "MaxRange", "MinRange", "Name" },
                values: new object[] { 2, "Alex", new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), 1000, 1, "FooBooLoo" });

            migrationBuilder.InsertData(
                table: "GameRules",
                columns: new[] { "Id", "Divisor", "GameTemplateId", "Replacement" },
                values: new object[,]
                {
                    { 3, 7, 2, "Foo" },
                    { 4, 11, 2, "Boo" },
                    { 5, 103, 2, "Loo" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "GameRules",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "GameRules",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "GameRules",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "GameTemplates",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
