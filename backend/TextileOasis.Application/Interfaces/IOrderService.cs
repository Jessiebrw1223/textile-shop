using TextileOasis.Application.DTOs;

namespace TextileOasis.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateAsync(int userId, CreateOrderDto dto);
    Task<IEnumerable<OrderDto>> GetMyOrdersAsync(int userId);
    Task<OrderDto?> GetByIdAsync(int orderId, int userId);
    Task<IEnumerable<OrderDto>> GetAllAsync();
}
