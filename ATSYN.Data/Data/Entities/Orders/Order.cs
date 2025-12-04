
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public enum OrderStatus
{
    Pending = 1,
    Confirmed = 2,
    Processing = 3,
    Shipped = 4,
    Delivered = 5,
    Cancelled = 6,
    Returned = 7,
    Refunded = 8
}
public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public bool IsPickup { get; set; }
    public string BillingAddress { get; set; } = string.Empty;
    public decimal SubTotal { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();
}
public class OrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string BillingAddress { get; set; } = string.Empty;
    public bool IsPickup { get; set; } = false;
    public decimal SubTotal { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<OrderItemDto> OrderItems { get; set; } = new();
}
public class OrderStatusHistoryDto
{
    public int Id { get; set; }
    public OrderStatus FromStatus { get; set; }
    public string FromStatusName { get; set; } = string.Empty;
    public OrderStatus ToStatus { get; set; }
    public string ToStatusName { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; }
    public string? Notes { get; set; }
    public string? ChangedBy { get; set; }
}

public class CreateOrderDto
{
    [Required]
    public string CustomerName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string CustomerEmail { get; set; } = string.Empty;
    
    
    public string ShippingAddress { get; set; } = string.Empty;

    public bool IsPickup { get; set; } = false;
    
    [Required]
    public string BillingAddress { get; set; } = string.Empty;
    
    public decimal ShippingCost { get; set; }
    public string? Notes { get; set; }
    
    [Required]
    public List<CreateOrderItemDto> OrderItems { get; set; } = new();
}
public class CreateOrderItemDto
{
    [Required]
    public int ProductId { get; set; }
    
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
    
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int? SelectedAttributeValueId { get; set; }
}

public class UpdateOrderStatusDto
{
    [Required]
    public OrderStatus Status { get; set; }
    public string? Notes { get; set; }
    public string? ChangedBy { get; set; }
}
public static class OrderStatusExtensions
{
    public static string GetDisplayName(this OrderStatus status)
    {
        return status switch
        {
            OrderStatus.Pending => "Pending",
            OrderStatus.Confirmed => "Confirmed",
            OrderStatus.Processing => "Processing",
            OrderStatus.Shipped => "Shipped",
            OrderStatus.Delivered => "Delivered",
            OrderStatus.Cancelled => "Cancelled",
            OrderStatus.Refunded => "Refunded",
            _ => status.ToString()
        };
    }
}

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(o => o.CustomerName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(o => o.CustomerEmail)
            .IsRequired()
            .HasMaxLength(254);

        builder.Property(o => o.ShippingAddress)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(o => o.BillingAddress)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(o => o.SubTotal)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.TaxAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.ShippingCost)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.TotalAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.Status)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(o => o.Notes)
            .HasMaxLength(1000);

        builder.Property(o => o.CreatedAt)
            .IsRequired();

        builder.Property(o => o.UpdatedAt)
            .IsRequired();

        builder.HasIndex(o => o.OrderNumber)
            .IsUnique();

        builder.HasIndex(o => o.CustomerEmail);
        builder.HasIndex(o => o.Status);
        builder.HasIndex(o => o.OrderDate);

        builder.ToTable("Orders");
    }
}
