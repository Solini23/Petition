using Microsoft.AspNetCore.Identity;

namespace PetitionPower.Data.Entities;

public class UserEntity : IdentityUser<Guid>, IEntity
{
    public DateTime CreatedAt { get; set; }
    public DateTime ModifiedAt { get; set; }
    public string? Picture { get; set; }

    public List<PetitionEntity> CreatedPetitions { get; set; } = [];

    public List<SignatureEntity> SignedPetitions { get; set; } = [];
}