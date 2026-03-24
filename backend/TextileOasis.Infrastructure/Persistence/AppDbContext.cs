using Microsoft.EntityFrameworkCore;
using TextileOasis.Domain.Entities;

namespace TextileOasis.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.Property(x => x.Description).HasMaxLength(300);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Products");
            entity.Property(x => x.Name).IsRequired().HasMaxLength(150);
            entity.Property(x => x.Description).HasMaxLength(500);
            entity.Property(x => x.ImageUrl).HasMaxLength(500);
            entity.Property(x => x.Material).HasMaxLength(100);
            entity.Property(x => x.Price).HasColumnType("decimal(18,2)");
            entity.HasOne(x => x.Category).WithMany(x => x.Products).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.Property(x => x.FullName).IsRequired().HasMaxLength(150);
            entity.Property(x => x.Email).IsRequired().HasMaxLength(150);
            entity.HasIndex(x => x.Email).IsUnique();
            entity.Property(x => x.PasswordHash).IsRequired().HasMaxLength(255);
            entity.Property(x => x.PhoneNumber).HasMaxLength(20);
            entity.Property(x => x.Role).IsRequired().HasMaxLength(30);
            entity.Property(x => x.ResetPasswordToken).HasMaxLength(200);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("Orders");
            entity.Property(x => x.Total).HasColumnType("decimal(18,2)");
            entity.Property(x => x.ShippingCost).HasColumnType("decimal(18,2)");
            entity.Property(x => x.Status).IsRequired().HasMaxLength(30);
            entity.Property(x => x.CustomerFullName).IsRequired().HasMaxLength(150);
            entity.Property(x => x.CustomerEmail).IsRequired().HasMaxLength(150);
            entity.Property(x => x.CustomerPhoneNumber).IsRequired().HasMaxLength(20);
            entity.Property(x => x.ShippingAddress).HasMaxLength(200);
            entity.Property(x => x.ShippingDistrict).HasMaxLength(100);
            entity.Property(x => x.ShippingCity).HasMaxLength(100);
            entity.Property(x => x.DeliveryType).IsRequired().HasMaxLength(20);
            entity.Property(x => x.PickupStoreAddress).HasMaxLength(200);
            entity.Property(x => x.PaymentMethod).IsRequired().HasMaxLength(30);
            entity.Property(x => x.PaymentStatus).IsRequired().HasMaxLength(30);
            entity.HasOne(x => x.User).WithMany(x => x.Orders).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.ToTable("OrderDetails");
            entity.Property(x => x.UnitPrice).HasColumnType("decimal(18,2)");
            entity.Property(x => x.SubTotal).HasColumnType("decimal(18,2)");
            entity.HasOne(x => x.Order).WithMany(x => x.OrderDetails).HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Product).WithMany(x => x.OrderDetails).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
        });
    }
}
