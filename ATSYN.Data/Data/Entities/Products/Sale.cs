using ATSYN.Api.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATSYN.Data.Data.Entities.Products
{
    public class Sale
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }

        public decimal SalePrice { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }

        public string? Name { get; set; }
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class SaleDto 
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public decimal SalePrice { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
    }

    public class CreateSaleDto 
    {
        public int ProductId { get; set; }
        public decimal SalePrice { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
    }

    public class SaleConfiguration : IEntityTypeConfiguration<Sale>
    {
        public void Configure(EntityTypeBuilder<Sale> builder)
        {
            builder.ToTable("Sales");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.SalePrice)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(s => s.StartDate)
                .IsRequired();

            builder.Property(s => s.EndDate)
                .IsRequired(false);

            builder.Property(s => s.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(s => s.Name)
                .HasMaxLength(200)
                .IsRequired(false);

            builder.Property(s => s.Description)
                .HasMaxLength(500)
                .IsRequired(false);

            builder.HasOne(s => s.Product)
                .WithMany(p => p.Sales)
                .HasForeignKey(s => s.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(s => s.ProductId)
                .HasDatabaseName("IX_Sales_ProductId");

            builder.HasIndex(s => s.IsActive)
                .HasDatabaseName("IX_Sales_IsActive");
        }
    }

}
