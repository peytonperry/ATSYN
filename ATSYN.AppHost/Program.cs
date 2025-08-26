var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.ATSYN_Api>("api")
    .WithExternalHttpEndpoints();

var frontend = builder.AddNpmApp("frontend", "../frontend")
    .WithReference(api)
    .WithEnvironment("BROWSER", "none") 
    .WithHttpEndpoint(env: "PORT");

builder.Build().Run();