using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ATSYN.Data.Data;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer("Server=127.0.0.1,1433;Database=sqldata;User Id=sa;Password=Mjyr4k-7rY0nGz1*5Y8jn};TrustServerCertificate=true");
        return new ApplicationDbContext(optionsBuilder.Options);
    }
}

//"Server=127.0.0.1,1433;Database=sqldata;User Id=sa;Password=Mjyr4k-7rY0nGz1*5Y8jn};TrustServerCertificate=true"
//"Server=localhost;Database=ATSYN_Design;Trusted_Connection=true;TrustServerCertificate=true;"