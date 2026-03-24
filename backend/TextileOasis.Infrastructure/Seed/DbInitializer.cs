using Microsoft.EntityFrameworkCore;
using TextileOasis.Domain.Entities;
using TextileOasis.Infrastructure.Persistence;

namespace TextileOasis.Infrastructure.Seed;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (!await context.Categories.AnyAsync())
        {
            context.Categories.AddRange(
                new Category
                {
                    Name = "Toallas",
                    Description = "Toallas de alta calidad para hogar, hotel y spa",
                    IsActive = true
                },
                new Category
                {
                    Name = "Batas",
                    Description = "Batas cómodas y elegantes para baño y descanso",
                    IsActive = true
                },
                new Category
                {
                    Name = "Sets",
                    Description = "Sets completos para hoteles y negocios",
                    IsActive = true
                }
            );

            await context.SaveChangesAsync();
        }

       if (await context.Products.AnyAsync())
{
    var products = await context.Products.ToListAsync();

    foreach (var product in products)
    {
        if (product.Name == "Toalla Blanca Premium")
            product.ImageUrl = "/images/product-1.jpg";

        if (product.Name == "Toalla de Mano Blanca")
            product.ImageUrl = "/images/product-4.jpg";

        if (product.Name == "Toalla de Piso Premium")
            product.ImageUrl = "/images/toalla-piso.jpg";

        if (product.Name == "Bata Spa Deluxe")
            product.ImageUrl = "/images/product-2.jpg";

        if (product.Name == "Set Hotelero Completo")
            product.ImageUrl = "/images/product-3.jpg";
    }

    await context.SaveChangesAsync();
}
else
{
    var categories = await context.Categories.ToListAsync();
    int cat(string name) => categories.First(c => c.Name == name).Id;

    context.Products.AddRange(
        new Product
        {
            Name = "Toalla Blanca Premium",
            Description = "Toalla suave de algodón para uso hotelero",
            Price = 45.90m,
            Stock = 40,
            ImageUrl = "/images/product-1.jpg",
            Material = "Algodón",
            IsFeatured = true,
            IsActive = true,
            CategoryId = cat("Toallas")
        },
        new Product
        {
            Name = "Toalla de Mano Blanca",
            Description = "Toalla compacta ideal para manos",
            Price = 25.90m,
            Stock = 50,
            ImageUrl = "/images/product-4.jpg",
            Material = "Algodón",
            IsFeatured = true,
            IsActive = true,
            CategoryId = cat("Toallas")
        },
        new Product
        {
            Name = "Toalla de Piso Premium",
            Description = "Toalla absorbente para baño",
            Price = 35.90m,
            Stock = 30,
            ImageUrl = "/images/toalla-piso.jpg",
            Material = "Algodón grueso",
            IsFeatured = true,
            IsActive = true,
            CategoryId = cat("Toallas")
        },
new Product
{
    Name = "Bata Spa Deluxe",
    Description = "Bata cómoda y elegante para spa y hotel",
    Price = 89.90m,
    Stock = 20,
    ImageUrl = "/images/category-robes.jpg",
    Material = "Algodón",
    IsFeatured = true,
    IsActive = true,
    CategoryId = cat("Batas")
},
        new Product
        {
            Name = "Set Hotelero Completo",
            Description = "Set ideal para equipamiento hotelero",
            Price = 320.00m,
            Stock = 15,
            ImageUrl = "/images/product-3.jpg",
            Material = "Algodón Egipcio",
            IsFeatured = true,
            IsActive = true,
            CategoryId = cat("Sets")
        }
    );

    await context.SaveChangesAsync();
}
        if (!await context.Users.AnyAsync())
        {
            context.Users.Add(new User
            {
                FullName = "Administrador TextileOasis",
                Email = "admin@textileoasis.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123*"),
                PhoneNumber = "999384593",
                Role = "Admin",
                IsActive = true
            });

            await context.SaveChangesAsync();
        }
    }
}
