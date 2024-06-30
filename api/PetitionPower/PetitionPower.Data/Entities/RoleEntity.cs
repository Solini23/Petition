using Microsoft.AspNetCore.Identity;

namespace PetitionPower.Data.Entities;

public class RoleEntity : IdentityRole<Guid>, IEntity
{
    public DateTime CreatedAt { get; set; }
    public DateTime ModifiedAt { get; set; }
}
