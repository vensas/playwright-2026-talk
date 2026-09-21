var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithImage("postgres", "16")
    .WithPgAdmin();

var database = postgres.AddDatabase("deployordie");

// The backend keeps port 5000. The frontend calls http://localhost:5000 from the
// browser, and the slides and the tests use the same port.
var backend = builder.AddProject<Projects.DeployOrDie_Api>("backend")
    .WithHttpEndpoint(port: 5000, targetPort: 5000, isProxied: false)
    .WithEnvironment("ConnectionStrings__DefaultConnection", database)
    .WaitFor(database);

// Rspack has no own Aspire resource type. AddJavaScriptApp runs the "dev" script,
// which starts rspack serve.
builder.AddJavaScriptApp("frontend", "../deploy-or-die-frontend")
    .WithPnpm()
    .WithHttpEndpoint(port: 3000, env: "PORT", isProxied: false)
    .WithExternalHttpEndpoints()
    .WaitFor(backend);

builder.Build().Run();
