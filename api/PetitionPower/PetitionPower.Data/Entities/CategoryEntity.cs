namespace PetitionPower.Data.Entities;
public record CategoryEntity : BaseEntity
{
    public required string Name { get; set; }
    public List<PetitionEntity> Petitions { get; set; } = [];
}
