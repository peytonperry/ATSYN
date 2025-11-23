using ATSYN.Api.Features;
using ATSYN.Data.Data.Entities.Products;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATSYN.Data.Data.Services
{
    public interface ISaleService
    {
        Task<Sale?> GetActiveSaleForProductAsync(int productId);
        Task<decimal> GetCurrentPriceForProductAsync(Product product);
    }

    public class SaleService : ISaleService
    {
        private readonly ApplicationDbContext _Context;

        public SaleService(ApplicationDbContext context)
        {
            _Context = context;
        }

        public async Task<Sale?> GetActiveSaleForProductAsync(int productId)
        {
            var now = DateTime.UtcNow;

            return await _Context.Sales
                .Where(s => s.ProductId == productId
                    && s.IsActive
                    && s.StartDate <= now
                    && (s.EndDate == null || s.EndDate >= now))
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<decimal> GetCurrentPriceForProductAsync(Product product)
        {
            var activeSale = await GetActiveSaleForProductAsync(product.Id);
            return activeSale?.SalePrice ?? product.Price;
        }
    }

}
