using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var sqlServer = builder.AddSqlServer("sql")
    .WithDataVolume();

var database = sqlServer.AddDatabase("atsyndb");

var api = builder.AddProject<Projects.ATSYN_Api>("api")
    .WithReference(database)
    .WithExternalHttpEndpoints();

var frontend = builder.AddNpmApp("frontend", "../frontend/ATSYN-client")
    .WithReference(api)
    .WithEnvironment("BROWSER", "none")
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("https"))
    .WithHttpEndpoint(env: "PORT");

builder.Build().Run();