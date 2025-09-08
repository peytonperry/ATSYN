using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var sql = builder.AddSqlServer("sql").WithDataVolume();
var db  = sql.AddDatabase("sqldata");

var migrations = builder.AddProject<Projects.AtsynApi_MigrationService>("migrations")
    .WithReference(db)
    .WaitFor(db);

var api = builder.AddProject<Projects.ATSYN_Api>("api")
    .WithReference(db)
    .WithReference(migrations)
    .WaitForCompletion(migrations)   
    .WithExternalHttpEndpoints()
    .WaitFor(db);

var frontend = builder.AddNpmApp("frontend", "../frontend/ATSYN-client")
    .WithReference(api)
    .WithEnvironment("BROWSER", "none")
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("https")).WaitFor(api)
    .WithHttpEndpoint(env: "PORT");

builder.Build().Run();