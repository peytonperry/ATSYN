using ATSYN.Api.Features;
using ATSYN.Data;
using ATSYN.Data.Data;
using ATSYN.Data.Data.Entities.Photo;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ATSYN.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Photos)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Price = p.Price,
                CategoryId = p.CategoryId,
                BrandId = p.BrandId,
                StockAmount = p.StockAmount,
                IsVisible = p.IsVisible,
                ShippingTypeId = p.ShippingTypeId,
                InStock = p.InStock,
                ImageUrl = p.ImageUrl,
                Category = new CategoryDto
                {
                    Id = p.Category.Id,
                    Name = p.Category.Name
                },
                Brand = p.Brand != null ? new BrandDto
                {
                    Id = p.Brand.Id,
                    Name = p.Brand.Name
                } : null,
                Photos = p.Photos
                    .OrderByDescending(ph => ph.IsPrimary)
                    .ThenBy(ph => ph.DisplayOrder)
                    .Select(ph => new PhotoDto
                    {
                        Id = ph.Id,
                        FileName = ph.FileName,
                        ContentType = ph.ContentType,
                        FileSize = ph.FileSize,
                        CreatedAt = ph.CreatedAt,
                        IsPrimary = ph.IsPrimary,
                        DisplayOrder = ph.DisplayOrder,
                        AltText = ph.AltText,
                        ImageUrl = $"/api/Photo/{ph.Id}"
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByCategory(int categoryId)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == categoryId);
        if (!categoryExists)
        {
            return NotFound($"Category with ID {categoryId} not found.");
        }

        var products = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Photos)
            .Where(p => p.CategoryId == categoryId)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                Price = p.Price,
                CategoryId = p.CategoryId,
                BrandId = p.BrandId,
                StockAmount = p.StockAmount,
                IsVisible = p.IsVisible,
                ShippingTypeId = p.ShippingTypeId,
                InStock = p.InStock,
                ImageUrl = p.ImageUrl,
                Category = new CategoryDto
                {
                    Id = p.Category.Id,
                    Name = p.Category.Name
                },
                Brand = p.Brand != null ? new BrandDto
                {
                    Id = p.Brand.Id,
                    Name = p.Brand.Name
                } : null,
                Photos = p.Photos
                    .OrderByDescending(ph => ph.IsPrimary)
                    .ThenBy(ph => ph.DisplayOrder)
                    .Select(ph => new PhotoDto
                    {
                        Id = ph.Id,
                        FileName = ph.FileName,
                        ContentType = ph.ContentType,
                        FileSize = ph.FileSize,
                        CreatedAt = ph.CreatedAt,
                        IsPrimary = ph.IsPrimary,
                        DisplayOrder = ph.DisplayOrder,
                        AltText = ph.AltText,
                        ImageUrl = $"/api/Photo/{ph.Id}"
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        var productDto = new ProductDto
        {
            Id = product.Id,
            Title = product.Title,
            Description = product.Description,
            Price = product.Price,
            CategoryId = product.CategoryId,
            BrandId = product.BrandId,
            StockAmount = product.StockAmount,
            IsVisible = product.IsVisible,
            ShippingTypeId = product.ShippingTypeId,
            InStock = product.InStock,
            ImageUrl = product.ImageUrl,
            Category = new CategoryDto
            {
                Id = product.Category.Id,
                Name = product.Category.Name
            },
            Brand = product.Brand != null ? new BrandDto
            {
                Id = product.Brand.Id,
                Name = product.Brand.Name
            } : null,
            Photos = product.Photos
                .OrderByDescending(ph => ph.IsPrimary)
                .ThenBy(ph => ph.DisplayOrder)
                .Select(ph => new PhotoDto
                {
                    Id = ph.Id,
                    FileName = ph.FileName,
                    ContentType = ph.ContentType,
                    FileSize = ph.FileSize,
                    CreatedAt = ph.CreatedAt,
                    IsPrimary = ph.IsPrimary,
                    DisplayOrder = ph.DisplayOrder,
                    AltText = ph.AltText,
                    ImageUrl = $"/api/Photo/{ph.Id}"
                })
                .ToList()
        };

        return Ok(productDto);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(ProductDto productDto)
    {
        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == productDto.CategoryId);

        if (!categoryExists)
        {
            return BadRequest($"Category with ID {productDto.CategoryId} does not exist.");
        }

        if (productDto.BrandId.HasValue)
        {
            var brandExists = await _context.Brands
                .AnyAsync(b => b.Id == productDto.BrandId.Value);

            if (!brandExists)
            {
                return BadRequest($"Brand with ID {productDto.BrandId} does not exist.");
            }
        }

        var product = new Product
        {
            Title = productDto.Title,
            Description = productDto.Description,
            Price = productDto.Price,
            CategoryId = productDto.CategoryId,
            BrandId = productDto.BrandId,
            StockAmount = productDto.StockAmount,
            IsVisible = productDto.IsVisible,
            ShippingTypeId = productDto.ShippingTypeId,
            ImageUrl = productDto.ImageUrl,
            InStock = productDto.InStock
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        var createdProduct = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Photos)
            .FirstAsync(p => p.Id == product.Id);

        var responseDto = new ProductDto
        {
            Id = createdProduct.Id,
            Title = createdProduct.Title,
            Description = createdProduct.Description,
            Price = createdProduct.Price,
            CategoryId = createdProduct.CategoryId,
            BrandId = createdProduct.BrandId,
            StockAmount = createdProduct.StockAmount,
            IsVisible = createdProduct.IsVisible,
            ShippingTypeId = createdProduct.ShippingTypeId,
            InStock = createdProduct.InStock,
            ImageUrl = createdProduct.ImageUrl,
            Category = new CategoryDto
            {
                Id = createdProduct.Category.Id,
                Name = createdProduct.Category.Name
            },
            Brand = createdProduct.Brand != null ? new BrandDto
            {
                Id = createdProduct.Brand.Id,
                Name = createdProduct.Brand.Name
            } : null,
            Photos = createdProduct.Photos
                .OrderByDescending(ph => ph.IsPrimary)
                .ThenBy(ph => ph.DisplayOrder)
                .Select(ph => new PhotoDto
                {
                    Id = ph.Id,
                    FileName = ph.FileName,
                    ContentType = ph.ContentType,
                    FileSize = ph.FileSize,
                    CreatedAt = ph.CreatedAt,
                    IsPrimary = ph.IsPrimary,
                    DisplayOrder = ph.DisplayOrder,
                    AltText = ph.AltText,
                    ImageUrl = $"/api/Photo/{ph.Id}"
                })
                .ToList()
        };

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, responseDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, ProductDto productDto)
    {
        if (id != productDto.Id)
        {
            return BadRequest("ID mismatch");
        }

        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        if (product.CategoryId != productDto.CategoryId)
        {
            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == productDto.CategoryId);

            if (!categoryExists)
            {
                return BadRequest($"Category with ID {productDto.CategoryId} does not exist.");
            }
        }

        // Validate brand if provided
        if (productDto.BrandId.HasValue && product.BrandId != productDto.BrandId)
        {
            var brandExists = await _context.Brands
                .AnyAsync(b => b.Id == productDto.BrandId.Value);

            if (!brandExists)
            {
                return BadRequest($"Brand with ID {productDto.BrandId} does not exist.");
            }
        }

        product.Title = productDto.Title;
        product.Description = productDto.Description;
        product.Price = productDto.Price;
        product.CategoryId = productDto.CategoryId;
        product.BrandId = productDto.BrandId;
        product.StockAmount = productDto.StockAmount;
        product.IsVisible = productDto.IsVisible;
        product.ShippingTypeId = productDto.ShippingTypeId;
        product.ImageUrl = productDto.ImageUrl;
        product.InStock = productDto.InStock;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await ProductExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> ProductExists(int id)
    {
        return await _context.Products.AnyAsync(e => e.Id == id);
    }
}