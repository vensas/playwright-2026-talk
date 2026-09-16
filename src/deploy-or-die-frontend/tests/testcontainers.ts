import path from 'path';
import { DockerComposeEnvironment, StartedDockerComposeEnvironment, AbstractStartedContainer } from "testcontainers";
import { execSync } from 'child_process';

let composeEnvironment: StartedDockerComposeEnvironment | null = null;
let manualCompose = false;

export async function setup() {
  // The mocked tests do not need a backend. The container start needs
  // about 30 seconds, so let the caller prevent it.
  if (process.env.SKIP_CONTAINERS === "1") {
    console.log("⏭️  SKIP_CONTAINERS=1 — no containers start.");
    return;
  }

  console.log("🐳 Starting Docker Compose environment...");

  // Disable Reaper for Podman compatibility
  process.env.TESTCONTAINERS_RYUK_DISABLED = "true";

  const composeFilePath = path.resolve(__dirname);
  const composeFile = "docker-compose.integration.yml";

  const backendHost = 'localhost';
  
  // Podman!
  try {
    composeEnvironment = await new DockerComposeEnvironment(
      composeFilePath,
      composeFile
    ).up();

    const backendContainer = composeEnvironment.getContainer("backend-1");
    const backendPort = backendContainer.getMappedPort(5000);
    // const backendHost = backendContainer.getHost();
    process.env.API_URL = `http://${backendHost}:${backendPort}`;

    console.log(`✅ Environment ready! Backend at ${process.env.API_URL}`);

    // Wait a bit for migrations to complete
    await new Promise((resolve) => setTimeout(resolve, 3000));
  } catch (error) {
    console.log("⚠️  Testcontainers failed, trying manual podman compose...");
    manualCompose = true;
    
    // Start with podman compose directly
    execSync(`podman compose -f ${path.join(composeFilePath, composeFile)} up -d`, {
      stdio: 'inherit',
      cwd: composeFilePath
    });

    // Get the backend port using podman port command
    const portOutput = execSync('podman port tests-backend-1 5000', {
      cwd: composeFilePath,
      encoding: 'utf-8'
    }).trim();
    
    // Output is like "0.0.0.0:54321" or "127.0.0.1:54321"
    const backendPort = portOutput.split(':')[1];

    process.env.API_URL = `http://${backendHost}:${backendPort}`;
    console.log(`✅ Environment ready! Backend at ${process.env.API_URL}`);

    // Wait a bit for migrations to complete
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

export async function teardown() {
  if (process.env.SKIP_CONTAINERS === "1") {
    return;
  }

  console.log("🧹 Stopping Docker Compose environment...");
  
  if (manualCompose) {
    const composeFilePath = path.resolve(__dirname);
    const composeFile = "docker-compose.integration.yml";
    execSync(`podman compose -f ${composeFile} down -v`, {
      stdio: 'inherit',
      cwd: composeFilePath
    });
  } else if (composeEnvironment) {
    await composeEnvironment.down();
  }
  
  console.log("✅ Cleanup complete");
}
