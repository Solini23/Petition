namespace PetitionPower.Web.Services.Auth.Dtos;

public record OAuthUserInfo
{
    public required string Id { get; set; }
    public required string Email { get; set; }
    public bool IsVerifiedUser { get; set; }
    public string? Picture { get; set; }
    //    {
    //    "id": "106633207726754330371",
    //    "email": "iiwooltrapii@gmail.com",
    //    "verified_email": true,
    //    "picture": "https://lh3.googleusercontent.com/a-/ALV-UjUS_eCkbm7N6ohfER8U5byfORmasWKmetM3EALlR2WsZCU=s96-c"
    //}
}