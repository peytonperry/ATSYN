using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class OrderStatusHistory
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public OrderStatus FromStatus { get; set; }
    public OrderStatus ToStatus { get; set; }
    public DateTime ChangedAt { get; set; }
    public string? Notes { get; set; }
    public string? ChangedBy { get; set; } 

    public Order Order { get; set; } = null!;
}


public class OrderStatusHistoryConfiguration : IEntityTypeConfiguration<OrderStatusHistory>
{
    public void Configure(EntityTypeBuilder<OrderStatusHistory> builder)
    {
        builder.HasKey(osh => osh.Id);

        builder.Property(osh => osh.FromStatus)
            .HasConversion<int>();

        builder.Property(osh => osh.ToStatus)
            .HasConversion<int>();

        builder.Property(osh => osh.ChangedAt)
            .IsRequired();

        builder.Property(osh => osh.Notes)
            .HasMaxLength(1000);

        builder.Property(osh => osh.ChangedBy)
            .HasMaxLength(100);

        // Relationships
        builder.HasOne(osh => osh.Order)
            .WithMany(o => o.StatusHistory)
            .HasForeignKey(osh => osh.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(osh => osh.ChangedAt);

        builder.ToTable("OrderStatusHistory");
    }
}