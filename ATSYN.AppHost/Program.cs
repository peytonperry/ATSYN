var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.ATSYN_Api>("api");

var frontend = builder.AddNpmApp("frontend", "../frontend/ATSYN-client")
    .WithHttpEndpoint(env: "PORT");

builder.Build().Run();


