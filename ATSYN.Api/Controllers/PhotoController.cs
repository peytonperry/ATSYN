using ATSYN.Api.Features;
using ATSYN.Data;
using Microsoft.AspNetCore.Mvc;
using ATSYN.Data.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Runtime.InteropServices;

namespace ATSYN.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PhotoController : ControllerBase
{
    private readonly ApplicationDbContext _context; // Replace with your actual DbContext name
    private readonly ILogger<PhotoController> _logger;

    public PhotoController(ApplicationDbContext context, ILogger<PhotoController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadPhoto([FromForm] CreatePhotoDto dto, [FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var product = await _context.Products.FindAsync(dto.ProductId);
        if (product == null)
            return NotFound("Product not found");

        var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
            return BadRequest("Invalid file type");

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest("File too large");

        try
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            if (dto.IsPrimary)
            {
                var existingPrimary = await _context.Photos
                    .Where(p => p.ProductId == dto.ProductId && p.IsPrimary)
                    .ToListAsync();

                foreach (var photo in existingPrimary)
                {
                    photo.IsPrimary = false;
                }
            }

            var newPhoto = new Photo
            {
                FileName = file.FileName,
                ImageData = memoryStream.ToArray(),
                ContentType = file.ContentType,
                FileSize = file.Length,
                ProductId = dto.ProductId,
                IsPrimary = dto.IsPrimary,
                DisplayOrder = dto.DisplayOrder,
                AltText = dto.AltText
            };

            _context.Photos.Add(newPhoto);
            await _context.SaveChangesAsync();

            return Ok(new PhotoDto
            {
                Id = newPhoto.Id,
                FileName = newPhoto.FileName,
                ContentType = newPhoto.ContentType,
                FileSize = newPhoto.FileSize,
                CreatedAt = newPhoto.CreatedAt,
                IsPrimary = newPhoto.IsPrimary,
                DisplayOrder = newPhoto.DisplayOrder,
                AltText = newPhoto.AltText,
                ImageUrl = $"/api/photos/{newPhoto.Id}"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading photo");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPhoto(int id)
    {
        var photo = await _context.Photos.FindAsync(id);
        if (photo == null)
            return NotFound();

        return File(photo.ImageData, photo.ContentType, photo.FileName);
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetPhotosByProduct(int productId)
    {
        var photos = await _context.Photos
            .Where(p => p.ProductId == productId)
            .OrderByDescending(p => p.IsPrimary)
            .ThenBy(p => p.DisplayOrder)
            .Select(p => new PhotoDto
            {
                Id = p.Id,
                FileName = p.FileName,
                ContentType = p.ContentType,
                FileSize = p.FileSize,
                CreatedAt = p.CreatedAt,
                IsPrimary = p.IsPrimary,
                DisplayOrder = p.DisplayOrder,
                AltText = p.AltText,
                ImageUrl = $"/api/photos/{p.Id}"
            })
            .ToListAsync();

        return Ok(photos);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePhoto(int id)
    {
        var photo = await _context.Photos.FindAsync(id);
        if (photo == null)
            return NotFound();

        _context.Photos.Remove(photo);
        await _context.SaveChangesAsync();
        return Ok();
    }
}