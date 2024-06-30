using PetitionPower.Web.Services.Auth.Dtos;

namespace PetitionPower.Web.Services.Petition.Dtos;

public record PetitionDto
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public int RequiredSignatures { get; set; }
    public DateTime ExpirationDate { get; set; }
    public required CategotyDto Category { get; set; }
    public required UserDto CreatedByUser { get; set; }
    public List<SignatureDto> Signatures { get; set; } = [];
}

public record SignatureDto
{
    public required Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public required PetitionDto Petition { get; set; }
    public required UserDto SignedByUser { get; set; }
}

public record UpdatePetitionDto
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public int RequiredSignatures { get; set; }
    public DateTime ExpirationDate { get; set; }
    public Guid CategoryId { get; set; }
}

public record CategotyDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
}