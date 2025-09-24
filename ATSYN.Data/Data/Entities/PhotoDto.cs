using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATSYN.Api.Features;

public class PhotoDto
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsPrimary { get; set; }
    public int DisplayOrder { get; set; }
    public string AltText { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}

public class CreatePhotoDto
{
    public required int ProductId { get; init; }
    public bool IsPrimary { get; init; } = false;
    public int DisplayOrder { get; init; } = 0;
    public string AltText { get; init; } = string.Empty;
}
