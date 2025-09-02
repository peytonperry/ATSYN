using ATSYN.Data;
using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults(); 


builder.Services.AddHostedService<Worker>();

builder.AddSqlServerDbContext<ApplicationDbContext>("sqldata", 
    configureDbContextOptions: options =>
    {
        options.UseSqlServer(connectionString =>
        {
            connectionString.MigrationsAssembly("ATSYN.Data");
        });
    });


var host = builder.Build();
host.Run();