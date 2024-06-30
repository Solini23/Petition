namespace PetitionPower.Data.Entities;

public record SignatureEntity : BaseEntity
{
    public Guid PetitionId { get; set; }
    public required PetitionEntity Petition { get; set; }
    public Guid SignedByUserId { get; set; }
    public required UserEntity SignedByUser { get; set; }
}
