using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ATSYN.Api.Features;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
}
public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; }
}
public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).IsRequired().HasMaxLength(50);
        builder.ToTable("Categories");
    }
}