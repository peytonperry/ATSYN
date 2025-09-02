using Microsoft.EntityFrameworkCore;
using ATSYN.Data;

public class Worker(IServiceProvider services, IHostApplicationLifetime lifetime) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.MigrateAsync(ct);
        lifetime.StopApplication(); 
    }
}