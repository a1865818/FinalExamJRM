using Microsoft.EntityFrameworkCore;
using WebApplication1.Entities;

namespace WebApplication1.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<GameTemplate> GameTemplates { get; set; }
        public DbSet<GameRule> GameRules { get; set; }
        public DbSet<GameSession> GameSessions { get; set; }
        public DbSet<GameAnswer> GameAnswers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // GameTemplate configuration using Fluent API
            modelBuilder.Entity<GameTemplate>(entity =>
            {
                entity.ToTable("GameTemplates");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnType("nvarchar(100)");

                entity.Property(e => e.Author)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnType("nvarchar(100)");

                entity.Property(e => e.MinRange)
                    .IsRequired()
                    .HasDefaultValue(1);

                entity.Property(e => e.MaxRange)
                    .IsRequired()
                    .HasDefaultValue(100);

                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // Indexes
                entity.HasIndex(e => e.Name)
                    .IsUnique()
                    .HasDatabaseName("IX_GameTemplates_Name");

                entity.HasIndex(e => e.Author)
                    .HasDatabaseName("IX_GameTemplates_Author");

                entity.HasIndex(e => e.CreatedAt)
                    .HasDatabaseName("IX_GameTemplates_CreatedAt");

                // Constraints
                entity.HasCheckConstraint("CK_GameTemplates_Range", "[MinRange] < [MaxRange]");
                entity.HasCheckConstraint("CK_GameTemplates_MinRange", "[MinRange] >= 1");
            });

            // GameRule configuration using Fluent API
            modelBuilder.Entity<GameRule>(entity =>
            {
                entity.ToTable("GameRules");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Divisor)
                    .IsRequired();

                entity.Property(e => e.Replacement)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnType("nvarchar(50)");

                entity.Property(e => e.GameTemplateId)
                    .IsRequired();

                // Relationships
                entity.HasOne(e => e.GameTemplate)
                    .WithMany(e => e.Rules)
                    .HasForeignKey(e => e.GameTemplateId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_GameRules_GameTemplates");

                // Indexes
                entity.HasIndex(e => e.GameTemplateId)
                    .HasDatabaseName("IX_GameRules_GameTemplateId");

                entity.HasIndex(e => new { e.GameTemplateId, e.Divisor })
                    .IsUnique()
                    .HasDatabaseName("IX_GameRules_GameTemplateId_Divisor");

                // Constraints
                entity.HasCheckConstraint("CK_GameRules_Divisor", "[Divisor] >= 2");
            });

            // GameSession configuration using Fluent API
            modelBuilder.Entity<GameSession>(entity =>
            {
                entity.ToTable("GameSessions");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.PlayerName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnType("nvarchar(100)");

                entity.Property(e => e.Duration)
                    .IsRequired();

                entity.Property(e => e.CorrectAnswers)
                    .IsRequired()
                    .HasDefaultValue(0);

                entity.Property(e => e.IncorrectAnswers)
                    .IsRequired()
                    .HasDefaultValue(0);

                entity.Property(e => e.IsCompleted)
                    .IsRequired()
                    .HasDefaultValue(false);

                entity.Property(e => e.StartedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.CompletedAt)
                    .IsRequired(false);

                entity.Property(e => e.GameTemplateId)
                    .IsRequired();

                // Relationships
                entity.HasOne(e => e.GameTemplate)
                    .WithMany()
                    .HasForeignKey(e => e.GameTemplateId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_GameSessions_GameTemplates");

                // Indexes
                entity.HasIndex(e => e.GameTemplateId)
                    .HasDatabaseName("IX_GameSessions_GameTemplateId");

                entity.HasIndex(e => e.StartedAt)
                    .HasDatabaseName("IX_GameSessions_StartedAt");

                entity.HasIndex(e => e.IsCompleted)
                    .HasDatabaseName("IX_GameSessions_IsCompleted");

                entity.HasIndex(e => e.PlayerName)
                    .HasDatabaseName("IX_GameSessions_PlayerName");

                // Constraints
                entity.HasCheckConstraint("CK_GameSessions_Duration", "[Duration] >= 10 AND [Duration] <= 300");
                entity.HasCheckConstraint("CK_GameSessions_Scores", "[CorrectAnswers] >= 0 AND [IncorrectAnswers] >= 0");
            });

            // GameAnswer configuration using Fluent API - FIXED with proper unique constraint
            modelBuilder.Entity<GameAnswer>(entity =>
            {
                entity.ToTable("GameAnswers");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Number)
                    .IsRequired();

                entity.Property(e => e.PlayerAnswer)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnType("nvarchar(200)");

                entity.Property(e => e.CorrectAnswer)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnType("nvarchar(200)");

                entity.Property(e => e.IsCorrect)
                    .IsRequired();

                entity.Property(e => e.AnsweredAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.GameSessionId)
                    .IsRequired();

                // Relationships
                entity.HasOne(e => e.GameSession)
                    .WithMany(e => e.Answers)
                    .HasForeignKey(e => e.GameSessionId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_GameAnswers_GameSessions");

                // Indexes
                entity.HasIndex(e => e.GameSessionId)
                    .HasDatabaseName("IX_GameAnswers_GameSessionId");

                entity.HasIndex(e => e.AnsweredAt)
                    .HasDatabaseName("IX_GameAnswers_AnsweredAt");

                entity.HasIndex(e => e.IsCorrect)
                    .HasDatabaseName("IX_GameAnswers_IsCorrect");

                // CRITICAL FIX: Change the existing index to be properly unique and prevent duplicates
                entity.HasIndex(e => new { e.GameSessionId, e.Number })
                    .IsUnique()
                    .HasDatabaseName("IX_GameAnswers_GameSessionId_Number_UNIQUE");

                // Constraints
                entity.HasCheckConstraint("CK_GameAnswers_Number", "[Number] >= 1");
            });

            // Seed default FizzBuzz game
            SeedData.Seed(modelBuilder);
        }
    }
}
