using ATSYN.Api.Features;
using ATSYN.Data.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ATSYN.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BrandController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BrandDto>>> GetBrands()
    {
        var brands = await _context.Brands
            .Select(b => new BrandDto
            {
                Id = b.Id,
                Name = b.Name,
            })
            .ToListAsync();
        return brands;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BrandDto>> GetBrand(int id)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null)
        {
            return NotFound();
        }
        
        var brandDto = new BrandDto()
        {
            Id = brand.Id,
            Name = brand.Name,
        };

        return Ok(brandDto);
    }

    [HttpPost]
    public async Task<ActionResult<BrandDto>> PostBrand(CreateBrandDto createBrandDto)
    {
        var existingBrand = await _context.Brands
            .FirstOrDefaultAsync(c => c.Name == createBrandDto.Name);

        if (existingBrand != null)
        {
            return Conflict($"Brand with name '{createBrandDto.Name}' already exists.");
        }

        var brand = new Brand()
        {
            Name = createBrandDto.Name,
        };
        
        _context.Brands.Add(brand);
        await _context.SaveChangesAsync();
        
        var brandDto = new BrandDto()
        {
            Id = brand.Id,
            Name = brand.Name
        };
        
        return CreatedAtAction("GetBrand", new { id = brand.Id }, brandDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutBrand(int id, UpdateBrandDto updateBrandDto)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null)
        {
            return NotFound();
        }

        var existingBrand = await _context.Brands
            .FirstOrDefaultAsync(b => b.Name == updateBrandDto.Name && b.Id != id);

        if (existingBrand != null)
        {
            return Conflict($"Brand with name '{updateBrandDto.Name}' already exists.");
        }

        brand.Name = updateBrandDto.Name;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!BrandExists(id))
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
    public async Task<IActionResult> DeleteBrand(int id)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null)
        {
            return NotFound();
        }

        var productsWithBrand = await _context.Products
            .AnyAsync(p => p.BrandId == id);

        if (productsWithBrand)
        {
            return BadRequest("Cannot delete brand because it is being used by one or more products.");
        }

        _context.Brands.Remove(brand);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool BrandExists(int id)
    {
        return _context.Brands.Any(e => e.Id == id);
    }
    
}