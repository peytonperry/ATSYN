using System.Reflection;
using ATSYN.Api.Features;
using ATSYN.Data.Data.Entities;
using ATSYN.Data.Data.Entities.News;
using ATSYN.Data.Data.Entities.Photo;
using ATSYN.Data.Data.Entities.Products;
using ATSYN.Data.Data.Entities.Reports;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;


namespace ATSYN.Data.Data;  

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Brand> Brands { get; set; }
    public DbSet<OrderStatusHistory> OrderStatusHistory { get; set; }
    public DbSet<ProductAttribute> ProductAttributes { get; set; }
    public DbSet<AttributeOption> AttributeOptions { get; set; }
    public DbSet<ProductAttributeValue> ProductAttributeValues { get; set; }
    public DbSet<Review> Reviews { get; set; }

    public DbSet<Photo> Photos { get; set; }
    public DbSet<News> News { get; set; }

    public DbSet<ContactSubmission> ContactSubmissions { get; set; }
    public DbSet<Report> Reports { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetAssembly(typeof(ApplicationDbContext))!);
    }
}