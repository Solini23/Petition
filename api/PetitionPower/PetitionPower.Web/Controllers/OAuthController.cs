using Azure;
using Microsoft.AspNetCore.Mvc;
using PetitionPower.Common;
using PetitionPower.Web.Services.Auth;
using PetitionPower.Web.Services.Auth.Dtos;
using PetitionPower.Web.Services.Common;

namespace PetitionPower.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OAuthController : ControllerBase
{
    private readonly IOAuthService oauthService;

    public OAuthController(IOAuthService oauthService)
    {
        this.oauthService = oauthService;
    }

    [HttpGet("login")]
    public async Task<IActionResult> RedirectOnOAuthServer(CancellationToken cancellationToken)
    {
        return Redirect(await oauthService.GetLoginUrl(cancellationToken));
    }

    [HttpGet("resolve-code")]
    public async Task<IActionResult> ResolveCodeAsync(string code, CancellationToken cancellationToken)
    {
        var authResponse = await oauthService.ResolveCodeAsync(code, cancellationToken);

        return Redirect(AppConstant.OAuth.Urls.ClientUrl + $"/external-login-page/{authResponse.Token}");
    }
}