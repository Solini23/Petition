namespace PetitionPower.Web.Services.Petition.Dtos;

public record CreatePetitionDto
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required Guid CategoryId { get; set; }
}