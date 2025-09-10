using ATSYN.Api.Features;
using ATSYN.Data;
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

    // GET: api/Category
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

    // GET: api/Category/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        
        if (category == null)
        {
            return NotFound();
        }

        var categoryDto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        };

        return Ok(categoryDto);
    }

    // GET: api/Category/5/products
    [HttpGet("{id}/products")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetCategoryProducts(int id)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == id);
        
        if (!categoryExists)
        {
            return NotFound("Category not found");
        }

        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.CategoryId == id)
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
                    Id = p.Category.Id,
                    Name = p.Category.Name
                }
            })
            .ToListAsync();

        return Ok(products);
    }

    // POST: api/Category
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory(CategoryDto categoryDto)
    {
        // Check if category name already exists
        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name.ToLower() == categoryDto.Name.ToLower());
            
        if (existingCategory != null)
        {
            return BadRequest("A category with this name already exists");
        }

        var category = new Category
        {
            Name = categoryDto.Name
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        categoryDto.Id = category.Id;
        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryDto);
    }

    // PUT: api/Category/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, CategoryDto categoryDto)
    {
        if (id != categoryDto.Id)
        {
            return BadRequest("Category ID mismatch");
        }

        var category = await _context.Categories.FindAsync(id);
        
        if (category == null)
        {
            return NotFound();
        }

        // Check if another category with the same name exists (excluding current category)
        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name.ToLower() == categoryDto.Name.ToLower() && c.Id != id);
            
        if (existingCategory != null)
        {
            return BadRequest("A category with this name already exists");
        }

        category.Name = categoryDto.Name;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CategoryExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Category/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        
        if (category == null)
        {
            return NotFound();
        }

        // Check if category has associated products
        var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
        
        if (hasProducts)
        {
            return BadRequest("Cannot delete category that has associated products. Please reassign or delete the products first.");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CategoryExists(int id)
    {
        return _context.Categories.Any(e => e.Id == id);
    }
}