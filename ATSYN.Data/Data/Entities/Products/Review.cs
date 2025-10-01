using ATSYN.Api.Features;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATSYN.Data.Data.Entities.Products
{
    public class Review
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int Rating { get; set; } // e.g., 1 to 5
        public string Title { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public Product Product { get; set; } = null!;
        public IdentityUser User { get; set; } = null!;
    }
}
