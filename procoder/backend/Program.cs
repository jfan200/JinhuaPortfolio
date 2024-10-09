using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using ProCoder.Data;
using ProCoder.Handler;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddFluentValidation(options =>
    {
        options.ImplicitlyValidateChildProperties = true;
        options.ImplicitlyValidateRootCollectionElements = true;
        options.RegisterValidatorsFromAssembly(Assembly.GetExecutingAssembly());
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Database
builder.Services.AddDbContext<MyDbContext>(
    options => options.UseSqlite(builder.Configuration["APIConnection"])
);

// Add Repo
builder.Services.AddScoped<IRepo, Repo>();

// Add authentication
builder.Services
    .AddAuthentication()
    .AddScheme<AuthenticationSchemeOptions, AuthHandler>("MyAuthentication", null)
    .AddScheme<AuthenticationSchemeOptions, AdminHandler>("AdminAuthentication", null);

// Add policy
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireClaim("admin"));
    options.AddPolicy("UserOnly", policy => policy.RequireClaim("userName"));
});

builder.Services.AddCors(p => p.AddPolicy("corsapp", builder =>
{
    builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
}));


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();
    dbContext.Database.Migrate();  // Apply migrations on startup
}

// Specify the URL to listen on
app.Urls.Add("http://*:8080");  // This will ensure the application listens on port 8080 inside the Docker container

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

//app cors
app.UseCors("corsapp");

app.Run();