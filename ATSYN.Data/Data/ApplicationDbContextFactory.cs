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
        connectionString = "Server=localhost,1433;Database=ATSYN_Design;User Id=sa;Password=YourStrongP@ssword;TrustServerCertificate=true;Encrypt=false;"
#else
        connectionString = "Server=127.0.0.1,1433;Database=ATSYN_Design;User Id=sa;Password=YourStrongP@assword;TrustServerCertificate=true;Encrypt=false;";
#endif
        
        optionsBuilder.UseSqlServer(connectionString);
        return new ApplicationDbContext(optionsBuilder.Options);
    }
}

//connectionString = "Server=localhost;Database=ATSYN_Design;Trusted_Connection=true;TrustServerCertificate=true;"
//"Server=127.0.0.1,1433;Database=ATSYN_Design;Trusted_Connection=true;User Id=sa;Password=YourStrongP@assword";