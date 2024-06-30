using PetitionPower.Web.Services.Common.Dtos;

namespace PetitionPower.Web.Services.Petition.Dtos;

public record FilteredPetitionsDto : PagedRequestDto
{
    public Guid? UserId { get; set; }
    public bool? IsSuccessful { get; set; }
    public bool? IsExpired { get; set; }
    public Guid? CategoryId { get; set; }
    public string? SearchTerm { get; set; }
}