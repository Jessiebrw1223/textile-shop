using Microsoft.EntityFrameworkCore;
using TextileOasis.Application.DTOs;
using TextileOasis.Application.Interfaces;
using TextileOasis.Domain.Entities;
using TextileOasis.Infrastructure.Persistence;

namespace TextileOasis.Infrastructure.Repositories;

public class OrderService : IOrderService
{
    private const string StoreAddress = "Jr. el Inca Nro. 1113";
    private readonly AppDbContext _context;
    public OrderService(AppDbContext context) => _context = context;

    public async Task<OrderDto> CreateAsync(int userId, CreateOrderDto dto)
    {
        if (dto.Items == null || dto.Items.Count == 0) throw new Exception("El pedido no tiene productos.");
        var productIds = dto.Items.Select(i => i.ProductId).ToList();
        var products = await _context.Products.Where(p => productIds.Contains(p.Id) && p.IsActive).ToListAsync();
        if (products.Count != productIds.Count) throw new Exception("Uno o más productos no existen o están inactivos.");

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId && u.IsActive)
            ?? throw new Exception("Usuario no encontrado.");

        if (string.IsNullOrWhiteSpace(dto.CustomerFullName)) dto.CustomerFullName = user.FullName;
        if (string.IsNullOrWhiteSpace(dto.CustomerEmail)) dto.CustomerEmail = user.Email;
        if (string.IsNullOrWhiteSpace(dto.CustomerPhoneNumber)) dto.CustomerPhoneNumber = user.PhoneNumber;

        if (string.IsNullOrWhiteSpace(dto.CustomerFullName) || string.IsNullOrWhiteSpace(dto.CustomerEmail) || string.IsNullOrWhiteSpace(dto.CustomerPhoneNumber))
            throw new Exception("Completa tus datos personales para registrar el pedido.");

        var deliveryType = string.Equals(dto.DeliveryType, "pickup", StringComparison.OrdinalIgnoreCase) ? "pickup" : "delivery";
        if (deliveryType == "delivery")
        {
            if (string.IsNullOrWhiteSpace(dto.ShippingAddress) || string.IsNullOrWhiteSpace(dto.ShippingDistrict) || string.IsNullOrWhiteSpace(dto.ShippingCity))
                throw new Exception("Completa dirección, distrito y ciudad para el envío por delivery.");
        }
        else
        {
            dto.ShippingAddress = StoreAddress;
            dto.ShippingDistrict = "Cercado";
            dto.ShippingCity = "Lima";
            dto.ShippingCost = 0;
        }

        var details = new List<OrderDetail>(); decimal subtotal = 0;
        foreach (var item in dto.Items)
        {
            var product = products.First(p => p.Id == item.ProductId);
            if (item.Quantity <= 0) throw new Exception("La cantidad debe ser mayor a cero.");
            if (product.Stock < item.Quantity) throw new Exception($"Stock insuficiente para {product.Name}.");
            var lineTotal = product.Price * item.Quantity;
            details.Add(new OrderDetail { ProductId = product.Id, Quantity = item.Quantity, UnitPrice = product.Price, SubTotal = lineTotal });
            product.Stock -= item.Quantity;
            subtotal += lineTotal;
        }

        var order = new Order
        {
            UserId = userId,
            Total = subtotal + dto.ShippingCost,
            ShippingCost = dto.ShippingCost,
            Status = "Pendiente",
            CustomerFullName = dto.CustomerFullName.Trim(),
            CustomerEmail = dto.CustomerEmail.Trim().ToLower(),
            CustomerPhoneNumber = dto.CustomerPhoneNumber.Trim(),
            ShippingAddress = dto.ShippingAddress.Trim(),
            ShippingDistrict = dto.ShippingDistrict.Trim(),
            ShippingCity = dto.ShippingCity.Trim(),
            DeliveryType = deliveryType,
            PickupStoreAddress = StoreAddress,
            PaymentMethod = dto.PaymentMethod.Trim().ToLower(),
            PaymentStatus = dto.PaymentMethod.Trim().ToLower() == "card" ? "Pendiente de pasarela" : "Pendiente",
            OrderDetails = details
        };
        _context.Orders.Add(order); await _context.SaveChangesAsync();
        return (await GetByIdAsync(order.Id, userId))!;
    }

    public async Task<IEnumerable<OrderDto>> GetMyOrdersAsync(int userId) =>
        await BuildQuery(_context.Orders.Where(o => o.UserId == userId)).OrderByDescending(o => o.CreatedAt).ToListAsync();

    public async Task<OrderDto?> GetByIdAsync(int orderId, int userId) =>
        await BuildQuery(_context.Orders.Where(o => o.UserId == userId)).FirstOrDefaultAsync(o => o.Id == orderId);

    public async Task<IEnumerable<OrderDto>> GetAllAsync() =>
        await BuildQuery(_context.Orders).OrderByDescending(o => o.CreatedAt).ToListAsync();

    private IQueryable<OrderDto> BuildQuery(IQueryable<Order> query) =>
        query.Include(o => o.OrderDetails)
            .ThenInclude(od => od.Product)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                CreatedAt = o.CreatedAt,
                Total = o.Total,
                ShippingCost = o.ShippingCost,
                Status = o.Status,
                CustomerFullName = o.CustomerFullName,
                CustomerEmail = o.CustomerEmail,
                CustomerPhoneNumber = o.CustomerPhoneNumber,
                ShippingAddress = o.ShippingAddress,
                ShippingDistrict = o.ShippingDistrict,
                ShippingCity = o.ShippingCity,
                DeliveryType = o.DeliveryType,
                PickupStoreAddress = o.PickupStoreAddress,
                PaymentMethod = o.PaymentMethod,
                PaymentStatus = o.PaymentStatus,
                Items = o.OrderDetails.Select(od => new OrderItemDto
                {
                    ProductId = od.ProductId,
                    ProductName = od.Product.Name,
                    Quantity = od.Quantity,
                    UnitPrice = od.UnitPrice,
                    SubTotal = od.SubTotal
                }).ToList()
            });
}
