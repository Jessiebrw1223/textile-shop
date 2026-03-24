using TextileOasis.Application.DTOs;

namespace TextileOasis.Application.Interfaces;

public interface IUserService
{
    Task<UserProfileDto?> GetProfileAsync(int userId);
    Task<IEnumerable<UserListItemDto>> GetAllAsync();
}
