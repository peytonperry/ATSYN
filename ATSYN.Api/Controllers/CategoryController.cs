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
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories([FromQuery] bool includeSubCategories = false)
    {
        var query = _context.Categories
            .Include(c => c.ParentCategory)
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.Name);

        if (includeSubCategories)
        {
            var allCategories = await query
                .Include(c => c.SubCategories)
                .ToListAsync();

            var rootCategories = allCategories
                .Where(c => c.ParentCategoryId == null)
                .Select(c => MapToCategoryDto(c, allCategories))
                .ToList();

            return Ok(rootCategories);
        }
        else
        {
            var categories = await query
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    ParentCategoryId = c.ParentCategoryId,
                    ParentCategoryName = c.ParentCategory != null ? c.ParentCategory.Name : null,
                    DisplayOrder = c.DisplayOrder,
                    IsActive = c.IsActive
                })
                .ToListAsync();

            return Ok(categories);
        }
    }

    [HttpGet("root")]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetRootCategories()
    {
        var categories = await _context.Categories
            .Where(c => c.IsActive && c.ParentCategoryId == null)
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ParentCategoryId = c.ParentCategoryId,
                DisplayOrder = c.DisplayOrder,
                IsActive = c.IsActive
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id}/subcategories")]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetSubCategories(int id)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == id && c.IsActive);
        if (!categoryExists)
        {
            return NotFound($"Category with ID {id} not found.");
        }

        var subCategories = await _context.Categories
            .Where(c => c.ParentCategoryId == id && c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ParentCategoryId = c.ParentCategoryId,
                ParentCategoryName = c.ParentCategory != null ? c.ParentCategory.Name : null,
                DisplayOrder = c.DisplayOrder,
                IsActive = c.IsActive
            })
            .ToListAsync();

        return Ok(subCategories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.ParentCategory)
            .Include(c => c.SubCategories.Where(sc => sc.IsActive))
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

        if (category == null)
        {
            return NotFound();
        }

        var categoryDto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ParentCategoryId = category.ParentCategoryId,
            ParentCategoryName = category.ParentCategory?.Name,
            DisplayOrder = category.DisplayOrder,
            IsActive = category.IsActive,
            SubCategories = category.SubCategories
                .Select(sc => new CategoryDto
                {
                    Id = sc.Id,
                    Name = sc.Name,
                    Description = sc.Description,
                    ParentCategoryId = sc.ParentCategoryId,
                    DisplayOrder = sc.DisplayOrder,
                    IsActive = sc.IsActive
                })
                .ToList()
        };

        return Ok(categoryDto);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto createDto)
    {
        if (createDto.ParentCategoryId.HasValue)
        {
            var parentExists = await _context.Categories
                .AnyAsync(c => c.Id == createDto.ParentCategoryId.Value && c.IsActive);

            if (!parentExists)
            {
                return BadRequest($"Parent category with ID {createDto.ParentCategoryId} does not exist.");
            }
        }

        var existingCategory = await _context.Categories
            .AnyAsync(c => c.Name == createDto.Name && c.IsActive);

        if (existingCategory)
        {
            return BadRequest($"A category with name '{createDto.Name}' already exists.");
        }

        var category = new Category
        {
            Name = createDto.Name,
            Description = createDto.Description,
            ParentCategoryId = createDto.ParentCategoryId,
            DisplayOrder = createDto.DisplayOrder,
            IsActive = createDto.IsActive
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        var createdCategory = await _context.Categories
            .Include(c => c.ParentCategory)
            .FirstAsync(c => c.Id == category.Id);

        var responseDto = new CategoryDto
        {
            Id = createdCategory.Id,
            Name = createdCategory.Name,
            Description = createdCategory.Description,
            ParentCategoryId = createdCategory.ParentCategoryId,
            ParentCategoryName = createdCategory.ParentCategory?.Name,
            DisplayOrder = createdCategory.DisplayOrder,
            IsActive = createdCategory.IsActive
        };

        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, responseDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto updateDto)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return NotFound();
        }

        if (updateDto.ParentCategoryId.HasValue)
        {
            if (updateDto.ParentCategoryId.Value == id)
            {
                return BadRequest("A category cannot be its own parent.");
            }

            var parentExists = await _context.Categories
                .AnyAsync(c => c.Id == updateDto.ParentCategoryId.Value && c.IsActive);

            if (!parentExists)
            {
                return BadRequest($"Parent category with ID {updateDto.ParentCategoryId} does not exist.");
            }

            var wouldCreateCycle = await WouldCreateCycle(id, updateDto.ParentCategoryId.Value);
            if (wouldCreateCycle)
            {
                return BadRequest("Cannot set parent category: would create a circular reference.");
            }
        }

        var duplicateName = await _context.Categories
            .AnyAsync(c => c.Name == updateDto.Name && c.Id != id && c.IsActive);

        if (duplicateName)
        {
            return BadRequest($"A category with name '{updateDto.Name}' already exists.");
        }

        category.Name = updateDto.Name;
        category.Description = updateDto.Description;
        category.ParentCategoryId = updateDto.ParentCategoryId;
        category.DisplayOrder = updateDto.DisplayOrder;
        category.IsActive = updateDto.IsActive;

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
        var category = await _context.Categories
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return NotFound();
        }

        if (category.SubCategories.Any(sc => sc.IsActive))
        {
            return BadRequest("Cannot delete a category that has active subcategories. Delete or reassign subcategories first.");
        }

        var hasActiveProducts = await _context.Products
            .AnyAsync(p => p.CategoryId == id && p.IsVisible);

        if (hasActiveProducts)
        {
            return BadRequest("Cannot delete a category that has active products. Delete or reassign products first.");
        }

        category.IsActive = false;

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

    private async Task<bool> CategoryExists(int id)
    {
        return await _context.Categories.AnyAsync(e => e.Id == id && e.IsActive);
    }

    private async Task<bool> WouldCreateCycle(int categoryId, int newParentId)
    {
        int? currentParentId = newParentId;

        while (currentParentId.HasValue)
        {
            if (currentParentId.Value == categoryId)
            {
                return true;
            }

            var parent = await _context.Categories.FindAsync(currentParentId.Value);
            currentParentId = parent?.ParentCategoryId;
        }

        return false;
    }

    private CategoryDto MapToCategoryDto(Category category, List<Category> allCategories)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ParentCategoryId = category.ParentCategoryId,
            ParentCategoryName = category.ParentCategory?.Name,
            DisplayOrder = category.DisplayOrder,
            IsActive = category.IsActive,
            SubCategories = allCategories
                .Where(c => c.ParentCategoryId == category.Id && c.IsActive)
                .Select(sc => MapToCategoryDto(sc, allCategories))
                .ToList()
        };
    }
}