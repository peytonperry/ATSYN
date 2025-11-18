using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var sqlServerPasswprd = builder
    .AddParameter("sql-server-password", "YourStrongP@assword", secret: true);

var smtp2goApiKey = builder.AddParameter("smtp2go-api-key", secret: true);

var stripeSecretKey = builder.AddParameter("stripe-secret-key", secret: true);
var stripePublishableKey = builder.AddParameter("stripe-publishable-key", secret: true);


var sql = builder
    .AddSqlServer(name: "ATSYN-SqlServer", port: 1433, password: sqlServerPasswprd)
    .WithLifetime(ContainerLifetime.Persistent)
    .WithDataVolume();

var db  = sql.AddDatabase("sqldata");

var migrations = builder.AddProject<Projects.AtsynApi_MigrationService>("migrations")
    .WithReference(db)
    .WaitFor(db);

var api = builder.AddProject<Projects.ATSYN_Api>("api")
    .WithReference(db)
    .WithEnvironment("Email__ApiKey", smtp2goApiKey)
    //replace email with clients 
    .WithEnvironment("Email__SenderAddress", "brennan.kimbrell@selu.edu")
    .WithEnvironment("Stripe__SecretKey", stripeSecretKey)
    .WithEnvironment("Stripe__PublishableKey", stripePublishableKey)
    .WaitForCompletion(migrations)   
    .WithExternalHttpEndpoints()
    .WaitFor(db);

var frontend = builder.AddNpmApp("frontend", "../frontend/ATSYN-client")
    .WithReference(api)
    .WithEnvironment("BROWSER", "none")
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("https")).WaitFor(api)
    .WithEnvironment("VITE_STRIPE_PUBLISHABLE_KEY", stripePublishableKey)    
    .WithHttpEndpoint(env: "PORT");

builder.Build().Run();