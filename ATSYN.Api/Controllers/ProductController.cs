using ATSYN.Api.Features;
using ATSYN.Data;
using ATSYN.Data.Data;
using ATSYN.Data.Data.Entities.Photo;
using ATSYN.Data.Data.Entities.Products;
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
            .Include(p => p.Reviews)
            .ThenInclude(p => p.User)
            .Include(p => p.AttributeValues)
            .ThenInclude(av => av.Attribute)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                ReviewCount = p.Reviews.Count,
                AverageRating = p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 0,
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
                AttributeValues = p.AttributeValues.Select(av => new ProductAttributeValueDto
                {
                    Id = av.Id,
                    AttributeId = av.AttributeId,
                    AttributeName = av.Attribute.Name,
                    Value = av.Value,
                    AttributeType = av.Attribute.Type
                }).ToList(),
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
                    .ToList(),
                Reviews = p.Reviews.Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    UserId = r.UserId,
                    UserName = r.User.UserName,
                    Rating = r.Rating,
                    Title = r.Title,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                }).ToList()
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
            .Include(p => p.Reviews)
            .ThenInclude(p => p.User)
            .Include(p => p.AttributeValues)
            .ThenInclude(av => av.Attribute)
            .Where(p => p.CategoryId == categoryId)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                ReviewCount = p.Reviews.Count,
                AverageRating = p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 0,
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
                AttributeValues = p.AttributeValues.Select(av => new ProductAttributeValueDto
                {
                    Id = av.Id,
                    AttributeId = av.AttributeId,
                    AttributeName = av.Attribute.Name,
                    Value = av.Value,
                    AttributeType = av.Attribute.Type
                }).ToList(),
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
                    .ToList(),
                Reviews = p.Reviews.Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    UserId = r.UserId,
                    UserName = r.User.UserName,
                    Rating = r.Rating,
                    Title = r.Title,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                }).ToList()
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
            .Include(p => p.Reviews)
            .ThenInclude(p => p.User)
            .Include(p => p.AttributeValues)
            .ThenInclude(av => av.Attribute)
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
            ReviewCount = product.Reviews.Count,
            AverageRating = product.Reviews.Any() ? product.Reviews.Average(r => r.Rating) : 0,
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
            AttributeValues = product.AttributeValues.Select(av => new ProductAttributeValueDto
            {
                Id = av.Id,
                AttributeId = av.AttributeId,
                AttributeName = av.Attribute.Name,
                Value = av.Value,
                AttributeType = av.Attribute.Type
            }).ToList(),
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
                .ToList(),
            Reviews = product.Reviews.Select(r => new ReviewDto
            {
                Id = r.Id,
                ProductId = r.ProductId,
                UserId = r.UserId,
                UserName = r.User?.UserName,
                Rating = r.Rating,
                Title = r.Title,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList()
        };

        return Ok(productDto);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createDto)
    {
        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == createDto.CategoryId);

        if (!categoryExists)
        {
            return BadRequest($"Category with ID {createDto.CategoryId} does not exist.");
        }

        if (createDto.BrandId.HasValue)
        {
            var brandExists = await _context.Brands
                .AnyAsync(b => b.Id == createDto.BrandId.Value);

            if (!brandExists)
            {
                return BadRequest($"Brand with ID {createDto.BrandId} does not exist.");
            }
        }

        if (createDto.AttributeValues.Any())
        {
            var attributeIds = createDto.AttributeValues.Select(av => av.AttributeId).Distinct().ToList();
            var validAttributes = await _context.ProductAttributes
                .Where(pa => attributeIds.Contains(pa.Id) && pa.CategoryId == createDto.CategoryId)
                .ToListAsync();

            if (validAttributes.Count != attributeIds.Count)
            {
                return BadRequest("One or more attributes do not belong to the selected category.");
            }

            var requiredAttributes = await _context.ProductAttributes
                .Where(pa => pa.CategoryId == createDto.CategoryId && pa.IsRequired)
                .Select(pa => pa.Id)
                .ToListAsync();

            var providedAttributeIds = createDto.AttributeValues.Select(av => av.AttributeId).ToList();
            var missingRequired = requiredAttributes.Except(providedAttributeIds).ToList();

            if (missingRequired.Any())
            {
                var missingNames = await _context.ProductAttributes
                    .Where(pa => missingRequired.Contains(pa.Id))
                    .Select(pa => pa.Name)
                    .ToListAsync();
                return BadRequest($"Missing required attributes: {string.Join(", ", missingNames)}");
            }
        }

        var product = new Product
        {
            Title = createDto.Title,
            Description = createDto.Description,
            Price = createDto.Price,
            CategoryId = createDto.CategoryId,
            BrandId = createDto.BrandId,
            StockAmount = createDto.StockAmount,
            IsVisible = createDto.IsVisible,
            ShippingTypeId = createDto.ShippingTypeId,
            ImageUrl = createDto.ImageUrl,
            InStock = createDto.StockAmount > 0
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        if (createDto.AttributeValues.Any())
        {
            var attributeValues = createDto.AttributeValues.Select(av => new ProductAttributeValue
            {
                ProductId = product.Id,
                AttributeId = av.AttributeId,
                Value = av.Value
            }).ToList();

            _context.ProductAttributeValues.AddRange(attributeValues);
            await _context.SaveChangesAsync();
        }

        var createdProduct = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Photos)
            .Include(p => p.AttributeValues)
            .ThenInclude(av => av.Attribute)
            .FirstAsync(p => p.Id == product.Id);

        var responseDto = new ProductDto
        {
            Id = createdProduct.Id,
            Title = createdProduct.Title,
            Description = createdProduct.Description,
            ReviewCount = createdProduct.Reviews.Count,
            AverageRating = createdProduct.Reviews.Any() ? createdProduct.Reviews.Average(r => r.Rating) : 0,
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
            AttributeValues = createdProduct.AttributeValues.Select(av => new ProductAttributeValueDto
            {
                Id = av.Id,
                AttributeId = av.AttributeId,
                AttributeName = av.Attribute.Name,
                Value = av.Value,
                AttributeType = av.Attribute.Type
            }).ToList(),
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
                .ToList(),
            Reviews = product.Reviews.Select(r => new ReviewDto
            {
                Id = r.Id,
                ProductId = r.ProductId,
                UserId = r.UserId,
                UserName = r.User.UserName,
                Rating = r.Rating,
                Title = r.Title,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList()

        };

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, responseDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto updateDto)
    {
        var product = await _context.Products
            .Include(p => p.AttributeValues)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        if (product.CategoryId != updateDto.CategoryId)
        {
            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == updateDto.CategoryId);

            if (!categoryExists)
            {
                return BadRequest($"Category with ID {updateDto.CategoryId} does not exist.");
            }
        }

        if (updateDto.BrandId.HasValue && product.BrandId != updateDto.BrandId)
        {
            var brandExists = await _context.Brands
                .AnyAsync(b => b.Id == updateDto.BrandId.Value);

            if (!brandExists)
            {
                return BadRequest($"Brand with ID {updateDto.BrandId} does not exist.");
            }
        }

        if (updateDto.AttributeValues.Any())
        {
            var attributeIds = updateDto.AttributeValues.Select(av => av.AttributeId).Distinct().ToList();
            var validAttributes = await _context.ProductAttributes
                .Where(pa => attributeIds.Contains(pa.Id) && pa.CategoryId == updateDto.CategoryId)
                .ToListAsync();

            if (validAttributes.Count != attributeIds.Count)
            {
                return BadRequest("One or more attributes do not belong to the selected category.");
            }

            var requiredAttributes = await _context.ProductAttributes
                .Where(pa => pa.CategoryId == updateDto.CategoryId && pa.IsRequired)
                .Select(pa => pa.Id)
                .ToListAsync();

            var providedAttributeIds = updateDto.AttributeValues.Select(av => av.AttributeId).ToList();
            var missingRequired = requiredAttributes.Except(providedAttributeIds).ToList();

            if (missingRequired.Any())
            {
                var missingNames = await _context.ProductAttributes
                    .Where(pa => missingRequired.Contains(pa.Id))
                    .Select(pa => pa.Name)
                    .ToListAsync();
                return BadRequest($"Missing required attributes: {string.Join(", ", missingNames)}");
            }
        }

        product.Title = updateDto.Title;
        product.Description = updateDto.Description;
        product.Price = updateDto.Price;
        product.CategoryId = updateDto.CategoryId;
        product.BrandId = updateDto.BrandId;
        product.StockAmount = updateDto.StockAmount;
        product.IsVisible = updateDto.IsVisible;
        product.ShippingTypeId = updateDto.ShippingTypeId;
        product.ImageUrl = updateDto.ImageUrl;
        product.InStock = updateDto.InStock;

        _context.ProductAttributeValues.RemoveRange(product.AttributeValues);

        if (updateDto.AttributeValues.Any())
        {
            var newAttributeValues = updateDto.AttributeValues.Select(av => new ProductAttributeValue
            {
                ProductId = product.Id,
                AttributeId = av.AttributeId,
                Value = av.Value
            }).ToList();

            _context.ProductAttributeValues.AddRange(newAttributeValues);
        }

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
        try
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            var hasOrderItems = await _context.OrderItems
                .AnyAsync(oi => oi.ProductId == id);

            if (hasOrderItems)
            {
                return Conflict(new
                {
                    message = "Cannot delete this product because it exists in customer order history."
                });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateException ex)
        {
            if (ex.InnerException?.Message.Contains("FK_OrderItems_Products") == true ||
                ex.InnerException?.Message.Contains("REFERENCE constraint") == true)
            {
                return Conflict(new
                {
                    message = "Cannot delete this product because it exists in customer order history."
                });
            }

            return StatusCode(500, new { message = "An error occurred while deleting the product." });
        }
    }

    private async Task<bool> ProductExists(int id)
    {
        return await _context.Products.AnyAsync(e => e.Id == id);
    }
}