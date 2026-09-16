using DeployOrDie.Api.Data;
using DeployOrDie.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<DeploymentContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() 
    { 
        Title = "Deploy or Die API", 
        Version = "v1",
        Description = "A fun deployment game API with a 50% success rate!"
    });
});

var app = builder.Build();

// Apply migrations on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DeploymentContext>();
    db.Database.Migrate();
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Deploy or Die API v1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

app.UseCors("AllowFrontend");

// Random number generator for deployment success/failure
var random = new Random();

// Witty error messages
var successMessages = new[]
{
    "🎉 Deployment successful! The servers are purring like kittens.",
    "✨ All systems operational! You're a deployment wizard!",
    "🚀 Deployed to production! Not a single thing broke (this time).",
    "🎊 Success! Your code is now in production. May the odds be ever in your favor.",
    "💚 Smooth deployment! Even the monitoring alerts are silent.",
    "🌟 Perfect deployment! Your PM will love you... for now.",
    "🏆 Champion! Everything deployed without a single rollback.",
    "🎯 Bullseye! Production is stable and the coffee is hot."
};

var errorMessages = new[]
{
    "💥 BOOM! The database just went on vacation. Permanently.",
    "🔥 Production is on fire! But not in a good way...",
    "💣 Critical failure! The servers have achieved sentience and they're angry.",
    "⚠️ Error 500: Internal Server Error. Also known as 'Oops, you broke it.'",
    "🚨 Alert! The deployment failed harder than a wet paper bag.",
    "😱 Panic! The load balancer is crying in the corner.",
    "💀 RIP Production. 2025-2025. It had a good run.",
    "🌊 Congratulations! You just created a data tsunami. Hope you have backups.",
    "🎪 The circus called. They want their deployment process back.",
    "⛔ Deployment rejected! Even the CI/CD pipeline is judging you."
};

// POST /api/deploy
app.MapPost("/api/deploy", async (DeploymentRequest request, DeploymentContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.DeployerName))
    {
        return Results.BadRequest(new DeploymentResult
        {
            Success = false,
            Message = "⚠️ Deployer name is required!"
        });
    }

    // 50% chance of success
    var success = random.Next(0, 2) == 1;
    var message = success 
        ? successMessages[random.Next(successMessages.Length)]
        : errorMessages[random.Next(errorMessages.Length)];

    var deployment = new Deployment
    {
        DeployedBy = request.DeployerName,
        Success = success,
        Message = message,
        Timestamp = DateTime.UtcNow
    };

    db.Deployments.Add(deployment);
    await db.SaveChangesAsync();

    return Results.Ok(new DeploymentResult
    {
        Success = success,
        Message = message,
        DeployedBy = request.DeployerName,
        Timestamp = deployment.Timestamp,
        Environment = request.Environment
    });
})
.WithName("DeployToProduction")
.WithDescription("Deploy to production with a 50% success rate!")
.Produces<DeploymentResult>(StatusCodes.Status200OK)
.Produces<DeploymentResult>(StatusCodes.Status400BadRequest);

app.Run();
