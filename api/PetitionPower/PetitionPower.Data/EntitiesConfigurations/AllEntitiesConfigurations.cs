using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetitionPower.Data.Entities;

namespace PetitionPower.Data.EntitiesConfigurations;

internal class RoleEntityConfiguration : BaseEntityConfiguration<RoleEntity>
{
}

internal class UserEntityConfiguration : BaseEntityConfiguration<UserEntity>
{

}

internal class PetitionEntityConfiguration : BaseEntityConfiguration<PetitionEntity>
{

}

internal class SignatureEntityConfiguration : BaseEntityConfiguration<SignatureEntity>
{
    public override void Configure(EntityTypeBuilder<SignatureEntity> builder)
    {
        base.Configure(builder);

        builder.HasOne(s => s.Petition)
            .WithMany(p => p.Signatures)
            .HasForeignKey(s => s.PetitionId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}

internal class CategoryEntityConfiguration : BaseEntityConfiguration<CategoryEntity>
{

}