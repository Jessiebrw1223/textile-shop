namespace TextileOasis.Domain.Entities;

public class Order
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public decimal Total { get; set; }
    public decimal ShippingCost { get; set; }
    public string Status { get; set; } = "Pending";
    public string CustomerFullName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhoneNumber { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string ShippingDistrict { get; set; } = string.Empty;
    public string ShippingCity { get; set; } = string.Empty;
    public string DeliveryType { get; set; } = "delivery";
    public string PickupStoreAddress { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = "cash";
    public string PaymentStatus { get; set; } = "Pending";
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
