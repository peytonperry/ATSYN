using ATSYN.Api.Features;
using ATSYN.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ATSYN.Data.Entities;

namespace ATSYN.Api.Controller
{

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

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category) 
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
                StockAmount = product.StockAmount,
                IsVisible = product.IsVisible,
                ShippingTypeId = product.ShippingTypeId,
                InStock = product.InStock,
                Category = new CategoryDto
                {
                    Id = product.Category.Id,
                    Name = product.Category.Name
                }
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
                return BadRequest("Invalid CategoryId");
            }

            var product = new Product
            {
                Title = productDto.Title,
                Description = productDto.Description,
                Price = productDto.Price,
                CategoryId = productDto.CategoryId,
                StockAmount = productDto.StockAmount,
                IsVisible = productDto.IsVisible,
                ShippingTypeId = productDto.ShippingTypeId,
                InStock = productDto.InStock
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            
            var createdProduct = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == product.Id);

            var resultDto = new ProductDto
            {
                Id = createdProduct!.Id,
                Title = createdProduct.Title,
                Description = createdProduct.Description,
                Price = createdProduct.Price,
                CategoryId = createdProduct.CategoryId,
                StockAmount = createdProduct.StockAmount,
                IsVisible = createdProduct.IsVisible,
                ShippingTypeId = createdProduct.ShippingTypeId,
                InStock = createdProduct.InStock,
                Category = new CategoryDto
                {
                    Id = createdProduct.Category.Id,
                    Name = createdProduct.Category.Name
                }
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, resultDto);
        }
    }
}