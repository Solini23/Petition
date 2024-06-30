namespace PetitionPower.Web.Services.Auth.Dtos;

public record UserDto
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public string? Picture { get; set; }
}