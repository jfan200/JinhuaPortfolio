using Microsoft.EntityFrameworkCore;
using ProCoder.Model;

namespace ProCoder.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        // DbSet<TEntity> property for each table
        public DbSet<AdminUser> AdminUsers { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<UserAchievement> UserAchievements { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<FollowComment> FollowComments { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Solution> Solutions { get; set; }
        public DbSet<Tag> Tags { get; set; }

        // connect to DB, use SQLite as DB
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=MyDatabase.sqlite");
        }

    }
}
