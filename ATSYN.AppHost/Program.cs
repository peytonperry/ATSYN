var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.ATSYN_Api>("api")
    .WithExternalHttpEndpoints();

var frontend = builder.AddNpmApp("frontend", "../frontend/ATSYN-client")
    .WithReference(api)
    .WithEnvironment("BROWSER", "none")
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("https"))
    .WithHttpEndpoint(env: "PORT");

builder.Build().Run();