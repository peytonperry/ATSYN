using ATSYN.Data.Data.Entities.Photo;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ATSYN.Api.Features;

public class Product
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public int? BrandId { get; set; } 
    public int StockAmount { get; set; }
    public bool IsVisible { get; set; }
    public int ShippingTypeId { get; set; }
    public bool InStock { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    
    public Category Category { get; set; } = null!;
    public Brand? Brand { get; set; }
    public ICollection<ProductAttributeValue> AttributeValues { get; set; } = new List<ProductAttributeValue>();

    public ICollection<Photo> Photos { get; set; } = new List<Photo>();
    public Photo? PrimaryPhoto => Photos.FirstOrDefault(p => p.IsPrimary)
                                ?? Photos.OrderBy(p => p.DisplayOrder).FirstOrDefault();
}

public class ProductDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public int? BrandId { get; set; } 
    public int StockAmount { get; set; }
    public bool IsVisible { get; set; }
    public int ShippingTypeId { get; set; }
    public bool InStock { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public CategoryDto Category { get; init; } = null!;
    public BrandDto? Brand { get; init; }
    public List<ProductAttributeValueDto> AttributeValues { get; init; } = new();
    public List<PhotoDto> Photos { get; init; } = new();
}


public class CreateProductDto
{
    public required string Title { get; init; }
    public string Description { get; init; } = string.Empty;
    public required decimal Price { get; init; }
    public required int CategoryId { get; init; }
    public int? BrandId { get; init; }
    public required int StockAmount { get; init; }
    public bool IsVisible { get; init; } = true;
    public required int ShippingTypeId { get; init; }
    public string ImageUrl { get; init; } = string.Empty;
    public List<CreateProductAttributeValueDto> AttributeValues { get; init; } = new();
}

public class UpdateProductDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public int? BrandId { get; set; }
    public int StockAmount { get; set; }
    public bool IsVisible { get; set; }
    public int ShippingTypeId { get; set; }
    public bool InStock { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public List<CreateProductAttributeValueDto> AttributeValues { get; set; } = new();
}

public class CreateProductAttributeValueDto
{
    public required int AttributeId { get; init; }
    public required string Value { get; init; }
}

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");
        
        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(p => p.Description)
            .IsRequired()
            .HasMaxLength(1000);
            
        builder.Property(p => p.Price)
            .IsRequired()
            .HasColumnType("decimal(18,2)");
            
        builder.Property(p => p.ImageUrl)
            .HasMaxLength(500);
            

        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products) 
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasOne(p => p.Brand)
            .WithMany(b => b.Products) 
            .HasForeignKey(p => p.BrandId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false); 
            
        
        builder.HasMany(p => p.AttributeValues)
            .WithOne(pav => pav.Product)
            .HasForeignKey(pav => pav.ProductId)
            .OnDelete(DeleteBehavior.Cascade); 
            
        
        builder.HasIndex(p => p.CategoryId)
            .HasDatabaseName("IX_Products_CategoryId");
            
        builder.HasIndex(p => p.BrandId)
            .HasDatabaseName("IX_Products_BrandId");
            
        builder.HasIndex(p => p.IsVisible)
            .HasDatabaseName("IX_Products_IsVisible");
            
        builder.HasIndex(p => p.InStock)
            .HasDatabaseName("IX_Products_InStock");

        builder.HasMany(p => p.Photos)
        .WithOne(ph => ph.Product)
        .HasForeignKey(ph => ph.ProductId)
        .OnDelete(DeleteBehavior.Cascade);
    }
}