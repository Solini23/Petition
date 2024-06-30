namespace PetitionPower.Web.Services.Auth.Dtos;

public record FacebookUserInfo
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required PictureData Picture { get; set; }
}

public record PictureData
{
    public required PictureDetails Data { get; set; }
}

public record PictureDetails
{
    public required int Height { get; set; }
    public required bool IsSilhouette { get; set; }
    public required string Url { get; set; }
    public required int Width { get; set; }
}
