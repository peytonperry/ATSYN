using ATSYN.Api.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=atsyn.db"));

builder.Services.AddOpenApi();

var app = builder.Build();

app.MapDefaultEndpoints();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
}

app.MapOpenApi();
app.MapScalarApiReference();

app.MapGet("/", () => "ATSYN API with SQLite is running!");

app.MapGet("/api/test", () => new { 
    message = "Test endpoint working", 
    timestamp = DateTime.UtcNow,
    environment = app.Environment.EnvironmentName 
});

app.MapGet("/api/health", () => new { 
    status = "healthy", 
    service = "ATSYN.Api",
    version = "1.0.0"
});

app.MapGet("/api/todos", async (ApplicationDbContext db) =>
    await db.TodoItems.ToListAsync());

app.MapPost("/api/todos", async (TodoItem todo, ApplicationDbContext db) =>
{
    db.TodoItems.Add(todo);
    await db.SaveChangesAsync();
    return Results.Created($"/api/todos/{todo.Id}", todo);
});

app.MapGet("/api/todos/{id}", async (int id, ApplicationDbContext db) =>
{
    var todo = await db.TodoItems.FindAsync(id);
    return todo is not null ? Results.Ok(todo) : Results.NotFound();
});

app.Run();