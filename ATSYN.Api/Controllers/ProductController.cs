using ATSYN.Data;
using ATSYN.Data.Data;
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
                    InStock = p.InStock
                })
                .ToListAsync();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

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
                InStock = product.InStock
            };

            return Ok(productDto);
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(ProductDto productDto)
        {
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

            productDto.Id = product.Id;
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
        }
    }
}