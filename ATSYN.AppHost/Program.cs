using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

// Add your API project (SQLite will be configured in the API itself)
var api = builder.AddProject<Projects.ATSYN_Api>("api")
    .WithExternalHttpEndpoints();

// Add your React frontend
var frontend = builder.AddNpmApp("frontend", "../frontend/ATSYN-client")
    .WithReference(api)
    .WithEnvironment("BROWSER", "none")
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("https"))
    .WithHttpEndpoint(env: "PORT");

builder.Build().Run();