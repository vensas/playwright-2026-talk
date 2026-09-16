using System.Text.RegularExpressions;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;
using Xunit;

namespace DeployOrDie.E2E.Tests;

/// <summary>
/// The same tests as in TypeScript, but in C#.
///
/// The API is equal in all languages: the same locators, the same
/// auto-wait, the same assertions. Only the names use the .NET style
/// (PascalCase and an "Async" suffix).
///
/// <para>PageTest gives each test its own Page, Context and Browser.</para>
/// </summary>
public class DeployTests : PageTest
{
    private const string BaseUrl = "http://localhost:3000";

    /// <summary>Replaces the API answer, so that the result is predictable.</summary>
    private async Task MockDeployAsync(bool success, string message)
    {
        await Page.RouteAsync("**/api/deploy", async route =>
        {
            await route.FulfillAsync(new RouteFulfillOptions
            {
                Status = 200,
                ContentType = "application/json",
                Json = new
                {
                    success,
                    message,
                    deployedBy = "C# Tester",
                    timestamp = DateTime.UtcNow.ToString("o")
                }
            });
        });
    }

    [Fact]
    public async Task Deploy_ShowsSuccessMessage()
    {
        await MockDeployAsync(true, "🎉 Deployment successful!");

        await Page.GotoAsync(BaseUrl);

        await Page.GetByLabel(new Regex("Who dares to deploy", RegexOptions.IgnoreCase))
            .FillAsync("C# Tester");
        await Page.GetByRole(AriaRole.Button, new() { NameRegex = new Regex("Deploy Now") })
            .ClickAsync();

        // Expect waits and tries again, exactly as in TypeScript.
        await Expect(Page.GetByText(new Regex("Deployment successful", RegexOptions.IgnoreCase)))
            .ToBeVisibleAsync();
    }

    [Fact]
    public async Task Deploy_ShowsErrorMessage()
    {
        await MockDeployAsync(false, "💥 BOOM! The database just went on vacation.");

        await Page.GotoAsync(BaseUrl);

        await Page.GetByLabel(new Regex("Who dares to deploy", RegexOptions.IgnoreCase))
            .FillAsync("C# Tester");
        await Page.GetByRole(AriaRole.Button, new() { NameRegex = new Regex("Deploy Now") })
            .ClickAsync();

        await Expect(Page.GetByText(new Regex("BOOM", RegexOptions.IgnoreCase)))
            .ToBeVisibleAsync();
    }

    [Fact]
    public async Task Deploy_WithoutName_ShowsValidationMessage()
    {
        await Page.GotoAsync(BaseUrl);

        await Page.GetByRole(AriaRole.Button, new() { NameRegex = new Regex("Deploy Now") })
            .ClickAsync();

        await Expect(Page.GetByText(new Regex("Please enter your name", RegexOptions.IgnoreCase)))
            .ToBeVisibleAsync();
    }

    [Fact]
    public async Task Cooldown_BlocksTheSecondDeployment()
    {
        // The Clock API also exists in .NET. The test controls the time.
        await Page.Clock.InstallAsync();
        await MockDeployAsync(true, "🎉 Deployment successful!");

        await Page.GotoAsync(BaseUrl);

        await Page.GetByLabel(new Regex("Who dares to deploy", RegexOptions.IgnoreCase))
            .FillAsync("C# Tester");

        var deploy = Page.GetByRole(AriaRole.Button,
            new() { NameRegex = new Regex("Deploy Now") });
        await deploy.ClickAsync();

        await Expect(Page.GetByRole(AriaRole.Button, new() { NameRegex = new Regex("Next deploy in") }))
            .ToBeDisabledAsync();

        // Move the time forward instead of a wait of 30 seconds.
        await Page.Clock.FastForwardAsync("00:30");
        await Expect(deploy).ToBeEnabledAsync();
    }
}
