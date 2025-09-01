using ATSYN.Data;
using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults(); 

builder.Services.AddDbContext<ApplicationDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("sqldata"),
        sql => sql.MigrationsAssembly("ATSYN.Data")));

builder.Services.AddHostedService<Worker>();

builder.AddSqlServerDbContext<ApplicationDbContext>("sqldata");


var host = builder.Build();
host.Run();