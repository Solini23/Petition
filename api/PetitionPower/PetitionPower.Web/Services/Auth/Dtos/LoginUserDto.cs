namespace PetitionPower.Web.Services.Auth.Dtos;

public record LoginUserDto
{
    public required string Email { get; set; }
    public string? Password { get; set; }
}

public record RegisterUserDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public string? Picture { get; set; }
}