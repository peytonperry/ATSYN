using Microsoft.EntityFrameworkCore;
using ATSYN.Data;
using ATSYN.Data.Data;

public class Worker(IServiceProvider services, IHostApplicationLifetime lifetime) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        using var scope = services.CreateScope();
        using var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.MigrateAsync(ct);
        lifetime.StopApplication(); 
    }
}