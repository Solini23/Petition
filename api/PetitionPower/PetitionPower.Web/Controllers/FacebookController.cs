using Microsoft.AspNetCore.Mvc;
using PetitionPower.Common;
using PetitionPower.Web.Services.Auth;
using PetitionPower.Web.Services.Auth.Dtos;

namespace PetitionPower.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FacebookController : ControllerBase
{
    private readonly IFacebookAuthService facebookService;

    public FacebookController(IFacebookAuthService facebookService)
    {
        this.facebookService = facebookService;
    }

    [HttpGet("login")]
    public IActionResult RedirectOnFacebookServer()
    {
        return Redirect(facebookService.GetLoginUrl());
    }

    [HttpGet("resolve-code")]
    public async Task<IActionResult> ResolveCodeAsync(string code, CancellationToken cancellationToken)
    {
        var authResponse = await facebookService.ResolveCode(code, cancellationToken);

        return Redirect(AppConstant.OAuth.Urls.ClientUrl + $"/external-login-page/{authResponse.Token}");
    }
}
