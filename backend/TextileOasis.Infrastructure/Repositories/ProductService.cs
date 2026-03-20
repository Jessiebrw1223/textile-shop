using Microsoft.EntityFrameworkCore;
using TextileOasis.Application.DTOs;
using TextileOasis.Application.Interfaces;
using TextileOasis.Domain.Entities;
using TextileOasis.Infrastructure.Persistence;

namespace TextileOasis.Infrastructure.Repositories;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;
    public ProductService(AppDbContext context) => _context = context;

    public async Task<IEnumerable<ProductDto>> GetAllAsync() => await Query().ToListAsync();
    public async Task<ProductDto?> GetByIdAsync(int id) => await Query().FirstOrDefaultAsync(p => p.Id == id);

    private IQueryable<ProductDto> Query() => _context.Products.Include(p => p.Category).Select(p => new ProductDto
    {
        Id = p.Id, Name = p.Name, Description = p.Description, Price = p.Price, Stock = p.Stock, ImageUrl = p.ImageUrl,
        Material = p.Material, IsFeatured = p.IsFeatured, IsActive = p.IsActive, CategoryId = p.CategoryId, CategoryName = p.Category.Name
    });

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        if (!await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId)) throw new Exception("La categoría no existe.");
        var product = new Product { Name = dto.Name.Trim(), Description = dto.Description.Trim(), Price = dto.Price, Stock = dto.Stock, ImageUrl = dto.ImageUrl.Trim(), Material = dto.Material.Trim(), IsFeatured = dto.IsFeatured, IsActive = true, CategoryId = dto.CategoryId };
        _context.Products.Add(product); await _context.SaveChangesAsync();
        return (await GetByIdAsync(product.Id))!;
    }
    public async Task<bool> UpdateAsync(int id, UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id); if (product is null) return false;
        product.Name = dto.Name.Trim(); product.Description = dto.Description.Trim(); product.Price = dto.Price; product.Stock = dto.Stock; product.ImageUrl = dto.ImageUrl.Trim(); product.Material = dto.Material.Trim(); product.IsFeatured = dto.IsFeatured; product.IsActive = dto.IsActive; product.CategoryId = dto.CategoryId;
        await _context.SaveChangesAsync(); return true;
    }
    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id); if (product is null) return false;
        _context.Products.Remove(product); await _context.SaveChangesAsync(); return true;
    }
}
