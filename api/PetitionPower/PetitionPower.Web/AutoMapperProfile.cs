using AutoMapper;
using PetitionPower.Data.Entities;
using PetitionPower.Web.Services.Auth.Dtos;
using PetitionPower.Web.Services.Petition.Dtos;

namespace PetitionPower.Web;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<UserEntity, UserDto>().ReverseMap();
        CreateMap<RegisterUserDto, UserEntity>();

        CreateMap<CreatePetitionDto, PetitionEntity>();
        CreateMap<UpdatePetitionDto, PetitionEntity>();
        CreateMap<PetitionEntity, PetitionDto>().ReverseMap();
        CreateMap<SignatureEntity, SignatureDto>().ReverseMap();

        CreateMap<CategoryEntity, CategotyDto>().ReverseMap();
    }
}
