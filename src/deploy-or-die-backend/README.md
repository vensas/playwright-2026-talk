# Deploy or Die Backend

ASP.NET Core Minimal API for the "Deploy or Die" game.

## Prerequisites

- .NET 9.0 SDK
- PostgreSQL 16+

## Setup

1. **Start PostgreSQL** (using Docker):
   ```bash
   docker run --name deployordie-postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=deployordie_dev \
     -p 5432:5432 \
     -d postgres:16
   ```

2. **Run database migrations**:
   ```bash
   cd DeployOrDie.Api
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

3. **Run the API**:
   ```bash
   dotnet run
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

- `POST /api/deploy` - Deploy with 50% success rate
  - Request: `{ "deployerName": "John Doe" }`
  - Response: `{ "success": true/false, "message": "...", "deployedBy": "...", "timestamp": "..." }`

- `GET /api/deployments` - Get deployment history (last 50)

- `GET /api/deployments/stats` - Get deployment statistics

## Database Schema

**Deployments** table:
- `Id` (int, primary key)
- `DeployedBy` (string, required)
- `Success` (bool)
- `Message` (string, required)
- `Timestamp` (datetime)
