using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ATSYN.Api.Features;

public sealed class Category
{
    public int Id { get; init; }
    public required string Name { get; init; }
}
public sealed class CategoryDto
{
    public int Id { get; init; }
    public required string Name { get; init; }
}
public sealed class CreateCategoryDto
{
    public required string Name { get; init; }
}

public sealed class UpdateCategoryDto
{
    public required string Name { get; init; }
}

public sealed class CategoryWithProductsDto
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public List<ProductDto> Products { get; init; } = new();
}

public sealed class CategoryProductCountDto
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public int TotalProducts { get; init; }
    public int VisibleProducts { get; init; }
    public int InStockProducts { get; init; }
}

public sealed class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");
        builder.HasIndex(x => x.Name).IsUnique();
    }
}