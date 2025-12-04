using ATSYN.Api.Features;
using ATSYN.Data;
using ATSYN.Data.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ATSYN.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductAttributeController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductAttributeController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductAttributeDto>>> GetProductAttributes()
    {
        var attributes = await _context.ProductAttributes
            .Include(pa => pa.Options)
            .Include(pa => pa.Category)
            .OrderBy(pa => pa.CategoryId)
            .ThenBy(pa => pa.DisplayOrder)
            .Select(pa => new ProductAttributeDto
            {
                Id = pa.Id,
                Name = pa.Name,
                Type = pa.Type,
                CategoryId = pa.CategoryId,
                IsRequired = pa.IsRequired,
                DisplayOrder = pa.DisplayOrder,
                Options = pa.Options
                    .OrderBy(o => o.DisplayOrder)
                    .Select(o => new AttributeOptionDto
                    {
                        Id = o.Id,
                        Value = o.Value,
                        DisplayOrder = o.DisplayOrder
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(attributes);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<IEnumerable<ProductAttributeDto>>> GetAttributesByCategory(int categoryId)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == categoryId);
        if (!categoryExists)
        {
            return NotFound($"Category with ID {categoryId} not found.");
        }

        var attributes = await _context.ProductAttributes
            .Include(pa => pa.Options)
            .Where(pa => pa.CategoryId == categoryId)
            .OrderBy(pa => pa.DisplayOrder)
            .Select(pa => new ProductAttributeDto
            {
                Id = pa.Id,
                Name = pa.Name,
                Type = pa.Type,
                CategoryId = pa.CategoryId,
                IsRequired = pa.IsRequired,
                DisplayOrder = pa.DisplayOrder,
                Options = pa.Options
                    .OrderBy(o => o.DisplayOrder)
                    .Select(o => new AttributeOptionDto
                    {
                        Id = o.Id,
                        Value = o.Value,
                        DisplayOrder = o.DisplayOrder
                    })
                    .ToList()
            })
            .ToListAsync();

        return Ok(attributes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductAttributeDto>> GetProductAttribute(int id)
    {
        var attribute = await _context.ProductAttributes
            .Include(pa => pa.Options)
            .FirstOrDefaultAsync(pa => pa.Id == id);

        if (attribute == null)
        {
            return NotFound();
        }

        var attributeDto = new ProductAttributeDto
        {
            Id = attribute.Id,
            Name = attribute.Name,
            Type = attribute.Type,
            CategoryId = attribute.CategoryId,
            IsRequired = attribute.IsRequired,
            DisplayOrder = attribute.DisplayOrder,
            Options = attribute.Options
                .OrderBy(o => o.DisplayOrder)
                .Select(o => new AttributeOptionDto
                {
                    Id = o.Id,
                    Value = o.Value,
                    DisplayOrder = o.DisplayOrder
                })
                .ToList()
        };

        return Ok(attributeDto);
    }

    [HttpPost]
    public async Task<ActionResult<ProductAttributeDto>> CreateProductAttribute(CreateProductAttributeDto createDto)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == createDto.CategoryId);
        if (!categoryExists)
        {
            return BadRequest($"Category with ID {createDto.CategoryId} does not exist.");
        }

        var existingAttribute = await _context.ProductAttributes
            .AnyAsync(pa => pa.CategoryId == createDto.CategoryId && pa.Name == createDto.Name);

        if (existingAttribute)
        {
            return BadRequest($"An attribute with name '{createDto.Name}' already exists for this category.");
        }

        var attribute = new ProductAttribute
        {
            Name = createDto.Name,
            Type = createDto.Type,
            CategoryId = createDto.CategoryId,
            IsRequired = createDto.IsRequired,
            DisplayOrder = createDto.DisplayOrder
        };

        _context.ProductAttributes.Add(attribute);
        await _context.SaveChangesAsync();

        if (createDto.Options.Any())
        {
            var options = createDto.Options.Select(o => new AttributeOption
            {
                AttributeId = attribute.Id,
                Value = o.Value,
                DisplayOrder = o.DisplayOrder
            }).ToList();

            _context.AttributeOptions.AddRange(options);
            await _context.SaveChangesAsync();
        }

        var createdAttribute = await _context.ProductAttributes
            .Include(pa => pa.Options)
            .FirstAsync(pa => pa.Id == attribute.Id);

        var responseDto = new ProductAttributeDto
        {
            Id = createdAttribute.Id,
            Name = createdAttribute.Name,
            Type = createdAttribute.Type,
            CategoryId = createdAttribute.CategoryId,
            IsRequired = createdAttribute.IsRequired,
            DisplayOrder = createdAttribute.DisplayOrder,
            Options = createdAttribute.Options
                .OrderBy(o => o.DisplayOrder)
                .Select(o => new AttributeOptionDto
                {
                    Id = o.Id,
                    Value = o.Value,
                    DisplayOrder = o.DisplayOrder
                })
                .ToList()
        };

        return CreatedAtAction(nameof(GetProductAttribute), new { id = attribute.Id }, responseDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProductAttribute(int id, UpdateProductAttributeDto updateDto)
    {
        var attribute = await _context.ProductAttributes
            .Include(pa => pa.Options)
            .FirstOrDefaultAsync(pa => pa.Id == id);

        if (attribute == null)
        {
            return NotFound();
        }

        var duplicateExists = await _context.ProductAttributes
            .AnyAsync(pa => pa.CategoryId == attribute.CategoryId && pa.Name == updateDto.Name && pa.Id != id);

        if (duplicateExists)
        {
            return BadRequest($"An attribute with name '{updateDto.Name}' already exists for this category.");
        }

        attribute.Name = updateDto.Name;
        attribute.Type = updateDto.Type;
        attribute.IsRequired = updateDto.IsRequired;
        attribute.DisplayOrder = updateDto.DisplayOrder;

        _context.AttributeOptions.RemoveRange(attribute.Options);

        if (updateDto.Options.Any())
        {
            var newOptions = updateDto.Options.Select(o => new AttributeOption
            {
                AttributeId = attribute.Id,
                Value = o.Value,
                DisplayOrder = o.DisplayOrder
            }).ToList();

            _context.AttributeOptions.AddRange(newOptions);
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await ProductAttributeExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProductAttribute(int id)
    {
        var attribute = await _context.ProductAttributes.FindAsync(id);
        if (attribute == null)
        {
            return NotFound();
        }

        _context.ProductAttributes.Remove(attribute);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> ProductAttributeExists(int id)
    {
        return await _context.ProductAttributes.AnyAsync(e => e.Id == id);
    }
}