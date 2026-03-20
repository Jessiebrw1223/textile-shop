namespace TextileOasis.Application.DTOs;

public class CreateOrderItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

public class CreateOrderDto
{
    public List<CreateOrderItemDto> Items { get; set; } = new();
    public string CustomerFullName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhoneNumber { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string ShippingDistrict { get; set; } = string.Empty;
    public string ShippingCity { get; set; } = string.Empty;
    public string DeliveryType { get; set; } = "delivery";
    public string PaymentMethod { get; set; } = "cash";
    public decimal ShippingCost { get; set; }
}

public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal { get; set; }
}

public class OrderDto
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal Total { get; set; }
    public decimal ShippingCost { get; set; }
    public string Status { get; set; } = string.Empty;
    public string CustomerFullName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhoneNumber { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string ShippingDistrict { get; set; } = string.Empty;
    public string ShippingCity { get; set; } = string.Empty;
    public string DeliveryType { get; set; } = string.Empty;
    public string PickupStoreAddress { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public List<OrderItemDto> Items { get; set; } = new();
}
