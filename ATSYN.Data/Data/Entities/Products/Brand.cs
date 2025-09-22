using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ATSYN.Api.Features;

public class Brand
{
    public int Id { get; init; }
    public string Name { get; set; } = string.Empty; 
    public ICollection<Product> Products { get; set; } = new List<Product>();
}

public class BrandDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
}

public sealed class CreateBrandDto
{
    public required string Name { get; init; }
}

public class UpdateBrandDto
{
    public string Name { get; set; } = string.Empty;
}

public class BrandConfiguration : IEntityTypeConfiguration<Brand>
{
    public void Configure(EntityTypeBuilder<Brand> builder)
    {

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.HasIndex(x => x.Name)
            .IsUnique();
        
        builder.ToTable("Brands");
    }
}