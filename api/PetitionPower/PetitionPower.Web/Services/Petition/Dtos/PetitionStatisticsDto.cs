namespace PetitionPower.Web.Services.Petition.Dtos;

public record PetitionStatisticsDto
{
    public int TotalPetitions { get; init; }
    public int TotalSignatures { get; init; }
    public int SuccessfulPetitions { get; init; }
    public int FailedPetitions { get; init; }
    public Dictionary<DateTime, int> CreatedPetitionsByDay { get; init; } = [];
    public Dictionary<DateTime, int> SignedPetitionsByDay { get; init; } = [];
    public Dictionary<DateTime, int> ExpiredPetitionsByDay { get; init; } = [];
}