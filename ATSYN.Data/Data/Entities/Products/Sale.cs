using ATSYN.Api.Features;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATSYN.Data.Data.Entities.Products
{
    public class Sale
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }

        public decimal SalePrice { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }

        public string? Name { get; set; }
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class SaleDto 
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public decimal SalePrice { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
    }

    public class CreateSaleDto 
    {
        public int ProductId { get; set; }
        public decimal SalePrice { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
    }

}
