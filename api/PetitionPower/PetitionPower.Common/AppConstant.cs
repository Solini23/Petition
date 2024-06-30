namespace PetitionPower.Common;

public static class AppConstant
{
    public record Roles
    {
        public const string User = "User";
        public const string Admin = "Admin";

        public static readonly string[] All = [User, Admin];
    }

    public record Claims
    {
        public const string Id = "id";
        public const string Roles = "roles";
    }

    public record JwtTokenLifetimes
    {
        public static readonly TimeSpan Default = TimeSpan.FromHours(12);
    }

    public record OAuth
    {
        public const string ClientId = "REPLACE_YOUR_KEY";
        public const string ClientSecret = "REPLACE_YOUR_KEY";
        public const string PkceSessionKey = "codeVerifier";

        public record Urls
        {
            public const string OAuthServerEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
            public const string TokenServerEndpoint = "https://oauth2.googleapis.com/token";
            public const string RedirectUrl = "https://localhost:5443/api/oauth/resolve-code";
            public const string ClientUrl = "http://localhost:3000";
        }

        public record Scopes
        {
            public const string ReadPhoneNumbers = "https://www.googleapis.com/auth/user.phonenumbers.read";
            public const string ViewPrimaryUserEmail = "https://www.googleapis.com/auth/userinfo.email";
            public const string ViewCustomerRelatedInformation = "https://www.googleapis.com/auth/admin.directory.customer.readonly";
        }
    }

    public record Facebook
    {
        public const string AppId = "REPLACE_YOUR_KEY";
        public const string AppSecret = "REPLACE_YOUR_KEY";
        public const string Version = "v19.0";
        public const string RedirectUrl = "https://localhost:5443/api/facebook/resolve-code";
    }

    public const int MinSignaturesCount = 200;
    public const int MaxDaysToCollectSignatures = 14;
}

