using Microsoft.EntityFrameworkCore;
using TextileOasis.Application.DTOs;
using TextileOasis.Application.Interfaces;
using TextileOasis.Domain.Entities;
using TextileOasis.Infrastructure.Persistence;

namespace TextileOasis.Infrastructure.Repositories;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;
    public CategoryService(AppDbContext context) => _context = context;

    public async Task<IEnumerable<CategoryDto>> GetAllAsync() => await _context.Categories.Select(c => new CategoryDto { Id = c.Id, Name = c.Name, Description = c.Description, IsActive = c.IsActive }).ToListAsync();
    public async Task<CategoryDto?> GetByIdAsync(int id) => await _context.Categories.Where(c => c.Id == id).Select(c => new CategoryDto { Id = c.Id, Name = c.Name, Description = c.Description, IsActive = c.IsActive }).FirstOrDefaultAsync();
    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        var category = new Category { Name = dto.Name.Trim(), Description = dto.Description.Trim(), IsActive = true };
        _context.Categories.Add(category); await _context.SaveChangesAsync();
        return new CategoryDto { Id = category.Id, Name = category.Name, Description = category.Description, IsActive = category.IsActive };
    }
    public async Task<bool> UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var category = await _context.Categories.FindAsync(id); if (category is null) return false;
        category.Name = dto.Name.Trim(); category.Description = dto.Description.Trim(); category.IsActive = dto.IsActive; await _context.SaveChangesAsync(); return true;
    }
    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id); if (category is null) return false;
        _context.Categories.Remove(category); await _context.SaveChangesAsync(); return true;
    }
}
