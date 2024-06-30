namespace PetitionPower.Data.Entities;

public record PetitionEntity : BaseEntity
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public int RequiredSignatures { get; set; }
    public DateTime ExpirationDate { get; set; }

    public Guid CategoryId { get; set; }
    public required CategoryEntity Category { get; set; }
    public Guid CreatedByUserId { get; set; }
    public required UserEntity CreatedByUser { get; set; }

    public List<SignatureEntity> Signatures { get; set; } = [];
}