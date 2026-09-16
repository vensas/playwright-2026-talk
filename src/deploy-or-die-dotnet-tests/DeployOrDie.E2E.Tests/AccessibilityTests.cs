using Deque.AxeCore.Commons;
using Deque.AxeCore.Playwright;
using Microsoft.Playwright.Xunit.v3;
using Xunit;

namespace DeployOrDie.E2E.Tests;

/// <summary>
/// The accessibility test in C#.
///
/// The TypeScript tests use @axe-core/playwright. For .NET there is
/// Deque.AxeCore.Playwright, which adds a RunAxe() method to Page and Locator.
/// The rules and the results are the same, because both use the same axe-core
/// engine.
/// </summary>
public class AccessibilityTests : PageTest
{
    private const string BaseUrl = "http://localhost:3000";

    [Fact]
    public async Task DeployPage_HasNoWcagViolations()
    {
        await Page.GotoAsync(BaseUrl);

        var results = await Page.RunAxe(new AxeRunOptions
        {
            RunOnly = new RunOnlyOptions
            {
                Type = "tag",
                Values = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
            },
        });

        var rules = results.Violations.Select(v => v.Id).ToArray();

        Assert.Empty(rules);
    }
}
