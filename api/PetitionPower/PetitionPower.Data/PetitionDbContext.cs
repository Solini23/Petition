using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PetitionPower.Data.Entities;
using System.Reflection;

namespace PetitionPower.Data;

public class PetitionDbContext : IdentityDbContext<UserEntity, RoleEntity, Guid>
{
    public PetitionDbContext(DbContextOptions<PetitionDbContext> options)
       : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
