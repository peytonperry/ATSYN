using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ATSYN.Data.Data;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        var connectionString = string.Empty;
        
#if OS_WINDOWS
        connectionString = "Server=localhost;Database=ATSYN_Design;Trusted_Connection=true;TrustServerCertificate=true;"
#else
        connectionString = "Server=127.0.0.1,1433;Database=ATSYN_Design;Trusted_Connection=true;Username=sa;Password=YourStrongP@assword";
#endif
        
        optionsBuilder.UseSqlServer(connectionString);
        return new ApplicationDbContext(optionsBuilder.Options);
    }
}

//"Server=127.0.0.1,1433;Database=sqldata;User Id=sa;Password=Mjyr4k-7rY0nGz1*5Y8jn};TrustServerCertificate=true"
//"Server=localhost;Database=ATSYN_Design;Trusted_Connection=true;TrustServerCertificate=true;"