using System.Reflection;
using ATSYN.Api.Features;
using ATSYN.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


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

    public DbSet<Photo> Photos { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetAssembly(typeof(ApplicationDbContext))!);
    }
}