using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ATSYN.Api.Features;

public class Category
{
    public int Id { get; init; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int? ParentCategoryId { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();
    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<ProductAttribute> Attributes { get; set; } = new List<ProductAttribute>();
}

public class CategoryDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public int? ParentCategoryId { get; init; }
    public string? ParentCategoryName { get; init; }
    public int DisplayOrder { get; init; }
    public bool IsActive { get; init; }
    public List<CategoryDto> SubCategories { get; init; } = new();
}

public class CreateCategoryDto
{
    public required string Name { get; init; }
    public string Description { get; init; } = string.Empty;
    public int? ParentCategoryId { get; init; }
    public int DisplayOrder { get; init; }
    public bool IsActive { get; init; } = true;
}

public class UpdateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int? ParentCategoryId { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Description)
            .HasMaxLength(500);

        builder.Property(c => c.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.HasOne(c => c.ParentCategory)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);

        builder.HasIndex(c => c.Name)
            .IsUnique()
            .HasDatabaseName("IX_Categories_Name");

        builder.HasIndex(c => c.ParentCategoryId)
            .HasDatabaseName("IX_Categories_ParentCategoryId");

        builder.HasIndex(c => c.DisplayOrder)
            .HasDatabaseName("IX_Categories_DisplayOrder");
    }
}