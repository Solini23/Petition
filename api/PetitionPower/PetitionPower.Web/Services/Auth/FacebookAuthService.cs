using Facebook;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using PetitionPower.Common;
using PetitionPower.Data.Entities;
using PetitionPower.Web.Services.Auth.Dtos;
using System.Threading;

namespace PetitionPower.Web.Services.Auth;

public interface IFacebookAuthService
{
    public Task<AuthResponse> ResolveCode(string code, CancellationToken cancellationToken);
    public string GetLoginUrl();
}

public class FacebookAuthService : IFacebookAuthService
{
    private readonly UserManager<UserEntity> userManager;
    private readonly IAuthService authService;

    public FacebookAuthService(UserManager<UserEntity> userManager, IAuthService authService)
    {
        this.userManager = userManager;
        this.authService = authService;
    }

    public async Task<AuthResponse> ResolveCode(string code, CancellationToken cancellationToken)
    {
        var client = new FacebookClient
        {
            Version = AppConstant.Facebook.Version
        };

        var accessTokenResponse = GetResponse<AccessTokenResponse>(() => client.Get("/oauth/access_token", new
        {
            client_id = AppConstant.Facebook.AppId,
            client_secret = AppConstant.Facebook.AppSecret,
            redirect_uri = AppConstant.Facebook.RedirectUrl,
            code
        }));

        client.AccessToken = accessTokenResponse.AccessToken;

        var facebookUser = GetResponse<FacebookUserInfo>(() => client.Get("me?fields=id,name,email,picture"));

        var dbUser = await userManager.FindByEmailAsync(facebookUser.Email);

        if (dbUser == null)
        {
            var password = "User@123"; // TODO: Replace by secure password
            //var password = Guid.NewGuid().ToString();

            return await authService.RegisterUser(new RegisterUserDto
            {
                Email = facebookUser.Email,
                Picture = facebookUser.Picture.Data.Url,
                Password = password
            }, cancellationToken);
        }

        dbUser.Picture = facebookUser.Picture.Data.Url;
        await userManager.UpdateAsync(dbUser);

        return await authService.LoginUser(new LoginUserDto
        {
            Email = facebookUser.Email
        }, cancellationToken, checkPassword: false);
    }

    public string GetLoginUrl()
    {
        var client = new FacebookClient
        {
            Version = AppConstant.Facebook.Version
        };

        var loginUrl = client.GetLoginUrl(new
        {
            client_id = AppConstant.Facebook.AppId,
            redirect_uri = AppConstant.Facebook.RedirectUrl,
            response_type = "code",
            scope = "public_profile,email"
        });

        return loginUrl.AbsoluteUri;
    }

    private static T GetResponse<T>(Func<object> apiCall)
    {
        dynamic result = apiCall.Invoke();
        string resultJson = JsonConvert.SerializeObject(result);
        return JsonConvert.DeserializeObject<T>(resultJson) ?? throw new ArgumentNullException("Could not deserialize response");
    }


    private record AccessTokenResponse
    {
        [JsonProperty("access_token")]
        public required string AccessToken { get; set; }

        [JsonProperty("token_type")]
        public required string TokenType { get; set; }

        [JsonProperty("expires_in")]
        public int ExpiresIn { get; set; }
    }
}
