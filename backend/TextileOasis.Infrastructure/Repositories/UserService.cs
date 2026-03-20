using Microsoft.EntityFrameworkCore;
using TextileOasis.Application.DTOs;
using TextileOasis.Application.Interfaces;
using TextileOasis.Infrastructure.Persistence;

namespace TextileOasis.Infrastructure.Repositories;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    public UserService(AppDbContext context) => _context = context;

    public async Task<UserProfileDto?> GetProfileAsync(int userId) =>
        await _context.Users
            .Where(u => u.Id == userId && u.IsActive)
            .Select(u => new UserProfileDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                Role = u.Role
            })
            .FirstOrDefaultAsync();

    public async Task<IEnumerable<UserListItemDto>> GetAllAsync() =>
        await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UserListItemDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                Role = u.Role,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();
}
