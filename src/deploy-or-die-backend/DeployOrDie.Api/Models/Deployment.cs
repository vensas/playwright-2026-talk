namespace DeployOrDie.Api.Models;

public class Deployment
{
    public int Id { get; set; }
    public required string DeployedBy { get; set; }
    public bool Success { get; set; }
    public required string Message { get; set; }
    public DateTime Timestamp { get; set; }
}

public class DeploymentRequest
{
    public required string DeployerName { get; set; }

    /// <summary>The target environment, for example "production".</summary>
    public string? Environment { get; set; }
}

public class DeploymentResult
{
    public bool Success { get; set; }
    public required string Message { get; set; }
    public string? DeployedBy { get; set; }
    public DateTime? Timestamp { get; set; }

    /// <summary>The target environment that the request gave.</summary>
    public string? Environment { get; set; }
}
