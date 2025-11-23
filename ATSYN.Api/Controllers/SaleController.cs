using ATSYN.Api.Features;
using ATSYN.Data.Data;
using ATSYN.Data.Data.Entities.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ATSYN.Api.Controllers;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Roles = "Admin")] // Only Admins can access this controller
public class SaleController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SaleController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Create a new sale
    [HttpPost]
    public async Task<ActionResult<SaleDto>> CreateSale([FromBody] CreateSaleDto dto)
    {
        var productExists = await _context.Products.AnyAsync(p => p.Id == dto.ProductId);
        if (!productExists)
        {
            return BadRequest($"Product with ID {dto.ProductId} does not exist.");
        }

        var sale = new Sale
        {
            ProductId = dto.ProductId,
            SalePrice = dto.SalePrice,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Name = dto.Name,
            Description = dto.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Sales.Add(sale);
        await _context.SaveChangesAsync();

        var saleDto = new SaleDto
        {
            Id = sale.Id,
            ProductId = sale.ProductId,
            SalePrice = sale.SalePrice,
            StartDate = sale.StartDate,
            EndDate = sale.EndDate,
            Name = sale.Name,
            Description = sale.Description,
            IsActive = sale.IsActive
        };

        return CreatedAtAction(nameof(GetSale), new { id = sale.Id }, saleDto);
    }

    // Get a specific sale
    [HttpGet("{id}")]
    public async Task<ActionResult<SaleDto>> GetSale(int id)
    {
        var sale = await _context.Sales
            .Include(s => s.Product)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sale == null) return NotFound();

        return new SaleDto
        {
            Id = sale.Id,
            ProductId = sale.ProductId,
            SalePrice = sale.SalePrice,
            StartDate = sale.StartDate,
            EndDate = sale.EndDate,
            Name = sale.Name,
            Description = sale.Description,
            IsActive = sale.IsActive
        };
    }

    // Get all sales
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SaleDto>>> GetAllSales()
    {
        var sales = await _context.Sales
            .Include(s => s.Product)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        return Ok(sales.Select(s => new SaleDto
        {
            Id = s.Id,
            ProductId = s.ProductId,
            SalePrice = s.SalePrice,
            StartDate = s.StartDate,
            EndDate = s.EndDate,
            Name = s.Name,
            Description = s.Description,
            IsActive = s.IsActive
        }));
    }

    // Get active sales only
    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<SaleDto>>> GetActiveSales()
    {
        var now = DateTime.UtcNow;

        var sales = await _context.Sales
            .Include(s => s.Product)
            .Where(s => s.IsActive
                && s.StartDate <= now
                && (s.EndDate == null || s.EndDate >= now))
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        return Ok(sales.Select(s => new SaleDto
        {
            Id = s.Id,
            ProductId = s.ProductId,
            SalePrice = s.SalePrice,
            StartDate = s.StartDate,
            EndDate = s.EndDate,
            Name = s.Name,
            Description = s.Description,
            IsActive = s.IsActive
        }));
    }

    // Update a sale
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSale(int id, [FromBody] CreateSaleDto dto)
    {
        var sale = await _context.Sales.FindAsync(id);
        if (sale == null) return NotFound();

        sale.SalePrice = dto.SalePrice;
        sale.StartDate = dto.StartDate;
        sale.EndDate = dto.EndDate;
        sale.Name = dto.Name;
        sale.Description = dto.Description;
        sale.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Deactivate a sale (soft delete)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeactivateSale(int id)
    {
        var sale = await _context.Sales.FindAsync(id);
        if (sale == null) return NotFound();

        sale.IsActive = false;
        sale.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Permanently delete a sale (optional - use with caution)
    [HttpDelete("{id}/permanent")]
    public async Task<IActionResult> DeleteSalePermanently(int id)
    {
        var sale = await _context.Sales.FindAsync(id);
        if (sale == null) return NotFound();

        _context.Sales.Remove(sale);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}