using ATSYN.Data;
using ATSYN.Data.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.AddSqlServerDbContext<ApplicationDbContext>("sqldata");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://192.168.69.21:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});



builder.Services.AddIdentity<IdentityUser,  IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;

    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<ApplicationDbContext>();
//codegen
builder.Services
  .AddControllers()
  .AddJsonOptions(options =>
  {
      options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
  });
//more codegen stuff
builder.Services.AddMvc();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.CustomOperationIds(e => $"{e.ActionDescriptor.RouteValues["action"]}");

    options.NonNullableReferenceTypesAsRequired();
    options.SupportNonNullableReferenceTypes();
    options.DescribeAllParametersInCamelCase();
});

var app = builder.Build();

app.MapScalarApiReference();

app.MapDefaultEndpoints();

app.MapOpenApi();

app.UseCors("AllowReactApp");


app.MapControllers();
app.UseAuthentication();
app.UseAuthorization();

app.Run();