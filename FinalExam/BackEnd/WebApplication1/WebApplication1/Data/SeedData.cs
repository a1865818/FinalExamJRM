using Microsoft.EntityFrameworkCore;
using WebApplication1.Entities;

namespace WebApplication1.Data
{
    public static class SeedData
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
         
            modelBuilder.Entity<GameTemplate>().HasData(
                new GameTemplate
                {
                    Id = 1,
                    Name = "Classic FizzBuzz",
                    Author = "System",
                    MinRange = 1,
                    MaxRange = 100,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new GameTemplate
                {
                    Id = 2,
                    Name = "FooBooLoo",
                    Author = "Alex",
                    MinRange = 1,
                    MaxRange = 1000,
                    CreatedAt = new DateTime(2025, 1, 2, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            modelBuilder.Entity<GameRule>().HasData(
                new GameRule { Id = 1, GameTemplateId = 1, Divisor = 3, Replacement = "Fizz" },
                new GameRule { Id = 2, GameTemplateId = 1, Divisor = 5, Replacement = "Buzz" },
                new GameRule { Id = 3, GameTemplateId = 2, Divisor = 7, Replacement = "Foo" },
                new GameRule { Id = 4, GameTemplateId = 2, Divisor = 11, Replacement = "Boo" },
                new GameRule { Id = 5, GameTemplateId = 2, Divisor = 103, Replacement = "Loo" }
            );
        }
    }
}
