using ATSYN.Api.Features;
using ATSYN.Data.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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
            .Select(pa => new ProductAttributeDto
            {
                Id = pa.Id,
                Name = pa.Name,
                Type = pa.Type,
                CategoryId = pa.CategoryId,
                IsRequired = pa.IsRequired,
                DisplayOrder = pa.DisplayOrder,
                Options = pa.Options.OrderBy(o => o.DisplayOrder).Select(o => new AttributeOptionDto
                {
                    Id = o.Id,
                    Value = o.Value,
                    DisplayOrder = o.DisplayOrder
                }).ToList()
            })
            .OrderBy(pa => pa.CategoryId)
            .ThenBy(pa => pa.DisplayOrder)
            .ToListAsync();

        return attributes;
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<IEnumerable<ProductAttributeDto>>> GetAttributesByCategory(int categoryId)
    {
        var category = await _context.Categories.FindAsync(categoryId);
        if (category == null)
        {
            return NotFound("Category not found.");
        }

        var attributes = await _context.ProductAttributes
            .Where(pa => pa.CategoryId == categoryId)
            .Include(pa => pa.Options)
            .Select(pa => new ProductAttributeDto
            {
                Id = pa.Id,
                Name = pa.Name,
                Type = pa.Type,
                CategoryId = pa.CategoryId,
                IsRequired = pa.IsRequired,
                DisplayOrder = pa.DisplayOrder,
                Options = pa.Options.OrderBy(o => o.DisplayOrder).Select(o => new AttributeOptionDto
                {
                    Id = o.Id,
                    Value = o.Value,
                    DisplayOrder = o.DisplayOrder
                }).ToList()
            })
            .OrderBy(pa => pa.DisplayOrder)
            .ToListAsync();

        return attributes;
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
            Options = attribute.Options.OrderBy(o => o.DisplayOrder).Select(o => new AttributeOptionDto
            {
                Id = o.Id,
                Value = o.Value,
                DisplayOrder = o.DisplayOrder
            }).ToList()
        };

        return attributeDto;
    }

    [HttpPost]
    public async Task<ActionResult<ProductAttributeDto>> PostProductAttribute(CreateProductAttributeDto createAttributeDto)
    {
        var category = await _context.Categories.FindAsync(createAttributeDto.CategoryId);
        if (category == null)
        {
            return BadRequest("Category not found.");
        }

        var existingAttribute = await _context.ProductAttributes
            .FirstOrDefaultAsync(pa => pa.CategoryId == createAttributeDto.CategoryId && pa.Name == createAttributeDto.Name);

        if (existingAttribute != null)
        {
            return Conflict($"Attribute with name '{createAttributeDto.Name}' already exists in this category.");
        }

        var validTypes = new[] { "text", "number", "select", "multiselect" };
        if (!validTypes.Contains(createAttributeDto.Type.ToLower()))
        {
            return BadRequest("Invalid attribute type. Valid types are: text, number, select, multiselect");
        }

        var attribute = new ProductAttribute
        {
            Name = createAttributeDto.Name,
            Type = createAttributeDto.Type.ToLower(),
            CategoryId = createAttributeDto.CategoryId,
            IsRequired = createAttributeDto.IsRequired,
            DisplayOrder = createAttributeDto.DisplayOrder
        };

        _context.ProductAttributes.Add(attribute);
        await _context.SaveChangesAsync();
        
        if ((createAttributeDto.Type.ToLower() == "select" || createAttributeDto.Type.ToLower() == "multiselect") 
            && createAttributeDto.Options.Any())
        {
            var options = createAttributeDto.Options.Select(optionDto => new AttributeOption
            {
                AttributeId = attribute.Id,
                Value = optionDto.Value,
                DisplayOrder = optionDto.DisplayOrder
            }).ToList();

            _context.AttributeOptions.AddRange(options);
            await _context.SaveChangesAsync();
        }

        var result = await GetProductAttribute(attribute.Id);
        return CreatedAtAction("GetProductAttribute", new { id = attribute.Id }, result.Value);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutProductAttribute(int id, UpdateProductAttributeDto updateAttributeDto)
    {
        var attribute = await _context.ProductAttributes
            .Include(pa => pa.Options)
            .FirstOrDefaultAsync(pa => pa.Id == id);

        if (attribute == null)
        {
            return NotFound();
        }

        var existingAttribute = await _context.ProductAttributes
            .FirstOrDefaultAsync(pa => pa.CategoryId == attribute.CategoryId && 
                                     pa.Name == updateAttributeDto.Name && 
                                     pa.Id != id);

        if (existingAttribute != null)
        {
            return Conflict($"Attribute with name '{updateAttributeDto.Name}' already exists in this category.");
        }

        attribute.Name = updateAttributeDto.Name;
        attribute.Type = updateAttributeDto.Type.ToLower();
        attribute.IsRequired = updateAttributeDto.IsRequired;
        attribute.DisplayOrder = updateAttributeDto.DisplayOrder;

        if (updateAttributeDto.Type.ToLower() == "select" || updateAttributeDto.Type.ToLower() == "multiselect")
        {
            _context.AttributeOptions.RemoveRange(attribute.Options);

            var newOptions = updateAttributeDto.Options.Select(optionDto => new AttributeOption
            {
                AttributeId = attribute.Id,
                Value = optionDto.Value,
                DisplayOrder = optionDto.DisplayOrder
            }).ToList();

            _context.AttributeOptions.AddRange(newOptions);
        }
        else
        {
            _context.AttributeOptions.RemoveRange(attribute.Options);
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductAttributeExists(id))
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProductAttribute(int id)
    {
        var attribute = await _context.ProductAttributes
            .Include(pa => pa.ProductAttributeValues)
            .FirstOrDefaultAsync(pa => pa.Id == id);

        if (attribute == null)
        {
            return NotFound();
        }

        if (attribute.ProductAttributeValues.Any())
        {
            return BadRequest("Cannot delete attribute because it is being used by one or more products.");
        }

        _context.ProductAttributes.Remove(attribute);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ProductAttributeExists(int id)
    {
        return _context.ProductAttributes.Any(e => e.Id == id);
    }
}