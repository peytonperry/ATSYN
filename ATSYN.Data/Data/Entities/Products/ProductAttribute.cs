using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ATSYN.Api.Features;

public class ProductAttribute
{
    public int Id { get; init; }
    public string Name { get; set; } = string.Empty; 
    public string Type { get; set; } = string.Empty; 
    public int CategoryId { get; set; }
    public bool IsRequired { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsVisibleToCustomers { get; set; } = true; 
    

    public Category Category { get; set; } = null!;
    public ICollection<AttributeOption> Options { get; set; } = new List<AttributeOption>();
    public ICollection<ProductAttributeValue> ProductAttributeValues { get; set; } = new List<ProductAttributeValue>();
}


public class AttributeOption
{
    public int Id { get; init; }
    public int AttributeId { get; set; }
    public string Value { get; set; } = string.Empty; 
    public int DisplayOrder { get; set; }
    

    public ProductAttribute Attribute { get; set; } = null!;
}


public class ProductAttributeValue
{
    public int Id { get; init; }
    public int ProductId { get; set; }
    public int AttributeId { get; set; }
    public string Value { get; set; } = string.Empty; 
    

    public Product Product { get; set; } = null!;
    public ProductAttribute Attribute { get; set; } = null!;
}


public class ProductAttributeDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public int CategoryId { get; init; }
    public bool IsRequired { get; init; }
    public int DisplayOrder { get; init; }
    public bool IsVisibleToCustomers { get; init; } = true; 
    public List<AttributeOptionDto> Options { get; init; } = new();
}

public class AttributeOptionDto
{
    public int Id { get; init; }
    public string Value { get; init; } = string.Empty;
    public int DisplayOrder { get; init; }
}

public class ProductAttributeValueDto
{
    public int Id { get; init; }
    public int AttributeId { get; init; }
    public string AttributeName { get; init; } = string.Empty;
    public string Value { get; init; } = string.Empty;
    public string AttributeType { get; init; } = string.Empty;
    public bool IsVisibleToCustomers { get; init; } = true; 
}

public class CreateProductAttributeDto
{
    public required string Name { get; init; }
    public required string Type { get; init; } 
    public required int CategoryId { get; init; }
    public bool IsRequired { get; init; }
    public int DisplayOrder { get; init; }
    public bool IsVisibleToCustomers { get; init; } = true; 
    public List<CreateAttributeOptionDto> Options { get; init; } = new();
}

public class CreateAttributeOptionDto
{
    public required string Value { get; init; }
    public int DisplayOrder { get; init; }
}

public class UpdateProductAttributeDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsRequired { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsVisibleToCustomers { get; set; } = true; 
    public List<CreateAttributeOptionDto> Options { get; set; } = new();
}


public class ProductAttributeConfiguration : IEntityTypeConfiguration<ProductAttribute>
{
    public void Configure(EntityTypeBuilder<ProductAttribute> builder)
    {
        builder.ToTable("ProductAttributes");
        
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(x => x.Type)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(x => x.IsVisibleToCustomers)
            .IsRequired()
            .HasDefaultValue(true); // NEW FIELD CONFIG
            
        builder.HasOne(x => x.Category)
            .WithMany(x => x.Attributes)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasIndex(x => new { x.CategoryId, x.Name })
            .IsUnique()
            .HasDatabaseName("IX_ProductAttributes_CategoryId_Name");
    }
}

public class AttributeOptionConfiguration : IEntityTypeConfiguration<AttributeOption>
{
    public void Configure(EntityTypeBuilder<AttributeOption> builder)
    {
        builder.ToTable("AttributeOptions");
        
        builder.Property(x => x.Value)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.HasOne(x => x.Attribute)
            .WithMany(x => x.Options)
            .HasForeignKey(x => x.AttributeId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasIndex(x => new { x.AttributeId, x.Value })
            .IsUnique()
            .HasDatabaseName("IX_AttributeOptions_AttributeId_Value");
    }
}

public class ProductAttributeValueConfiguration : IEntityTypeConfiguration<ProductAttributeValue>
{
    public void Configure(EntityTypeBuilder<ProductAttributeValue> builder)
    {
        builder.ToTable("ProductAttributeValues");
        
        builder.Property(x => x.Value)
            .IsRequired()
            .HasMaxLength(500);
            
        builder.HasOne(x => x.Product)
            .WithMany(x => x.AttributeValues)
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasOne(x => x.Attribute)
            .WithMany(x => x.ProductAttributeValues)
            .HasForeignKey(x => x.AttributeId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasIndex(x => new { x.ProductId, x.AttributeId })
            .IsUnique()
            .HasDatabaseName("IX_ProductAttributeValues_ProductId_AttributeId");
    }
}