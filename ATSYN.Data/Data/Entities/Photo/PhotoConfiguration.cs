using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ATSYN.Data.Data.Entities.Photo;

public class PhotoConfiguration : IEntityTypeConfiguration<Photo>
{
    public void Configure(EntityTypeBuilder<Photo> builder)
    {
        builder.ToTable("Photos");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.FileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(p => p.ContentType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.ImageData)
            .IsRequired()
            .HasColumnType("varbinary(max)");

        builder.Property(p => p.AltText)
            .HasMaxLength(500);

        // Configure relationship with Product
        builder.HasOne(p => p.Product)
            .WithMany(pr => pr.Photos)
            .HasForeignKey(p => p.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes for better query performance
        builder.HasIndex(p => p.ProductId)
            .HasDatabaseName("IX_Photos_ProductId");

        builder.HasIndex(p => new { p.ProductId, p.IsPrimary })
            .HasDatabaseName("IX_Photos_ProductId_IsPrimary");
    }
}