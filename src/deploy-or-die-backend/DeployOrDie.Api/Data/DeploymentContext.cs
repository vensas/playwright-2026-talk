using DeployOrDie.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DeployOrDie.Api.Data;

public class DeploymentContext : DbContext
{
    public DeploymentContext(DbContextOptions<DeploymentContext> options)
        : base(options)
    {
    }

    public DbSet<Deployment> Deployments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Deployment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.DeployedBy).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Message).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Timestamp).IsRequired();
            entity.HasIndex(e => e.Timestamp);
        });
    }
}
