using ATSYN.Api.Features;

namespace ATSYN.Data.Data.Entities.Photo;

public class Photo
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public byte[] ImageData { get; set; } = Array.Empty<byte>();
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Link to Product
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    // Optional: Set primary/featured photo
    public bool IsPrimary { get; set; } = false;

    // Optional: Display order for multiple photos
    public int DisplayOrder { get; set; } = 0;

    // Optional: Alt text for accessibility
    public string AltText { get; set; } = string.Empty;
}
