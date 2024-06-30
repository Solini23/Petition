using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using PetitionPower.Common.Exceptions;
using PetitionPower.Data.Entities;
using PetitionPower.Web.Services.Auth.Dtos;
using PetitionPower.Web.Services.Common;
using static PetitionPower.Common.AppConstant;

namespace PetitionPower.Web.Services.Auth;

public interface IOAuthService
{
    public string GenerateOAuthRequestUrl(string redirectUrl, string codeChellange);
    public Task<OAuthToken> ExchangeCodeOnTokenAsync(string code, string codeVerifier, string redirectUrl, CancellationToken cancellationToken);
    public Task<OAuthUserInfo> GetUserAsync(string token, CancellationToken cancellationToken);
    public Task<string> GetLoginUrl(CancellationToken cancellation);
    public Task<AuthResponse> ResolveCodeAsync(string code, CancellationToken cancellationToken);
}

public class OAuthService : IOAuthService
{
    private readonly IHttpClientService httpClientService;
    private readonly IHttpContextAccessor httpContextAccessor;
    private readonly UserManager<UserEntity> userManager;
    private readonly IAuthService authService;

    public OAuthService(IHttpClientService httpClientService, IHttpContextAccessor httpContextAccessor, UserManager<UserEntity> userManager, IAuthService authService)
    {
        this.httpClientService = httpClientService;
        this.httpContextAccessor = httpContextAccessor;
        this.userManager = userManager;
        this.authService = authService;
    }

    public Task<string> GetLoginUrl(CancellationToken cancellationToken)
    {
        var codeVerifier = Guid.NewGuid().ToString();
        var codeChellange = Sha256Service.ComputeHash(codeVerifier);

        if (httpContextAccessor.HttpContext == null)
        {
            throw new BadRequestException("HttpContext was null");
        }

        httpContextAccessor.HttpContext.Session.SetString(OAuth.PkceSessionKey, codeVerifier);

        var url = GenerateOAuthRequestUrl(OAuth.Urls.RedirectUrl, codeChellange);

        return Task.FromResult(url);
    }

    public async Task<AuthResponse> ResolveCodeAsync(string code, CancellationToken cancellationToken)
    {
        if (httpContextAccessor.HttpContext == null)
        {
            throw new BadRequestException("HttpContext was null");
        }

        var codeVerifier = httpContextAccessor.HttpContext.Session.GetString(OAuth.PkceSessionKey);

        if (string.IsNullOrEmpty(codeVerifier))
        {
            throw new BadRequestException("Code verifier was null or empty");
        }

        var tokenResult = await ExchangeCodeOnTokenAsync(code, codeVerifier, OAuth.Urls.RedirectUrl, cancellationToken);

        var oauthUser = await GetUserAsync(tokenResult.AccessToken, cancellationToken);

        var dbUser = await userManager.FindByEmailAsync(oauthUser.Email);

        if (dbUser == null)
        {
            var password = "User@123"; // TODO: Replace by secure password
            //var password = Guid.NewGuid().ToString();

            return await authService.RegisterUser(new RegisterUserDto
            {
                Email = oauthUser.Email,
                Picture = oauthUser.Picture,
                Password = password
            }, cancellationToken);
        }

        dbUser.Picture = oauthUser.Picture;
        await userManager.UpdateAsync(dbUser);

        return await authService.LoginUser(new LoginUserDto
        {
            Email = oauthUser.Email
        }, cancellationToken, checkPassword: false);
    }

    public string GenerateOAuthRequestUrl(string redirectUrl, string codeChellange)
    {
        var scope = getAllScopes();
        var queryParams = new Dictionary<string, string?>
            {
                { "client_id", OAuth.ClientId},
                { "redirect_uri", redirectUrl },
                { "response_type", "code" },
                { "scope", scope },
                { "code_challenge", codeChellange },
                { "code_challenge_method", "S256" },
                { "access_type", "offline" }
        };

        var url = QueryHelpers.AddQueryString(OAuth.Urls.OAuthServerEndpoint, queryParams);
        return url;
    }

    public async Task<OAuthToken> ExchangeCodeOnTokenAsync(string code, string codeVerifier, string redirectUrl, CancellationToken cancellationToken)
    {
        var authParams = new Dictionary<string, string>
            {
                { "client_id", OAuth.ClientId },
                { "client_secret", OAuth.ClientSecret },
                { "code", code },
                { "code_verifier", codeVerifier },
                { "grant_type", "authorization_code" },
                { "redirect_uri", redirectUrl }
        };

        var tokenResult = await httpClientService.PostAsync<OAuthToken>(OAuth.Urls.TokenServerEndpoint, authParams, cancellationToken);
        return tokenResult;
    }

    private string getAllScopes()
    {
        var scopes = new List<string>()
            {
                OAuth.Scopes.ReadPhoneNumbers,
                OAuth.Scopes.ViewPrimaryUserEmail,
                OAuth.Scopes.ViewCustomerRelatedInformation
            };
        return string.Join(" ", scopes);
    }

    public async Task<OAuthUserInfo> GetUserAsync(string token, CancellationToken cancellationToken)
    {
        var userInfo = await httpClientService.GetAsync<OAuthUserInfo>(
            "https://www.googleapis.com/oauth2/v1/userinfo",
             new Dictionary<string, string?>()
             {
                 { "access_token", token }
             }, cancellationToken);

        return userInfo;
    }
}