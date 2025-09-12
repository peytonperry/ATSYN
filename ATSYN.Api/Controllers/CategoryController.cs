using ATSYN.Api.Features;
using ATSYN.Data;
using ATSYN.Data.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ATSYN.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoryController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var categories = await _context.Categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return NotFound($"Category with ID {id} not found.");
        }

        var categoryDto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        };

        return Ok(categoryDto);
    }

    [HttpGet("{id}/products")]
    public async Task<ActionResult<CategoryWithProductsDto>> GetCategoryWithProducts(int id)
    {
        var category = await _context.Categories
            .Where(c => c.Id == id)
            .Select(c => new CategoryWithProductsDto
            {
                Id = c.Id,
                Name = c.Name,
                Products = _context.Products
                    .Where(p => p.CategoryId == c.Id)
                    .Select(p => new ProductDto
                    {
                        Id = p.Id,
                        Title = p.Title,
                        Description = p.Description,
                        Price = p.Price,
                        CategoryId = p.CategoryId,
                        StockAmount = p.StockAmount,
                        IsVisible = p.IsVisible,
                        ShippingTypeId = p.ShippingTypeId,
                        InStock = p.InStock,
                        Category = new CategoryDto
                        {
                            Id = c.Id,
                            Name = c.Name
                        }
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (category == null)
        {
            return NotFound($"Category with ID {id} not found.");
        }

        return Ok(category);
    }

    [HttpGet("name/{name}")]
    public async Task<ActionResult<CategoryDto>> GetCategoryByName(string name)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name == name);

        if (category == null)
        {
            return NotFound($"Category with name '{name}' not found.");
        }

        var categoryDto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        };

        return Ok(categoryDto);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto createCategoryDto)
    {
        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name == createCategoryDto.Name);

        if (existingCategory != null)
        {
            return Conflict($"Category with name '{createCategoryDto.Name}' already exists.");
        }

        var category = new Category
        {
            Name = createCategoryDto.Name
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        var categoryDto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        };

        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto updateCategoryDto)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return NotFound($"Category with ID {id} not found.");
        }

        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name == updateCategoryDto.Name && c.Id != id);

        if (existingCategory != null)
        {
            return Conflict($"Category with name '{updateCategoryDto.Name}' already exists.");
        }

        _context.Categories.Remove(category);
        
        var updatedCategory = new Category
        {
            Id = id,
            Name = updateCategoryDto.Name
        };

        _context.Categories.Add(updatedCategory);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await CategoryExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return NotFound($"Category with ID {id} not found.");
        }

        var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
        if (hasProducts)
        {
            return BadRequest($"Cannot delete category '{category.Name}' because it has associated products. Please reassign or delete the products first.");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("{id}/products/count")]
    public async Task<ActionResult<CategoryProductCountDto>> GetCategoryProductCount(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return NotFound($"Category with ID {id} not found.");
        }

        var productCount = await _context.Products.CountAsync(p => p.CategoryId == id);
        var visibleProductCount = await _context.Products.CountAsync(p => p.CategoryId == id && p.IsVisible);
        var inStockProductCount = await _context.Products.CountAsync(p => p.CategoryId == id && p.InStock);

        var result = new CategoryProductCountDto
        {
            Id = category.Id,
            Name = category.Name,
            TotalProducts = productCount,
            VisibleProducts = visibleProductCount,
            InStockProducts = inStockProductCount
        };

        return Ok(result);
    }

    private async Task<bool> CategoryExists(int id)
    {
        return await _context.Categories.AnyAsync(e => e.Id == id);
    }
}

