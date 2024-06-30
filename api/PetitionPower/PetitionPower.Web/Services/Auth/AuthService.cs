using AutoMapper;
using Microsoft.AspNetCore.Identity;
using PetitionPower.Common.Exceptions;
using PetitionPower.Common;
using PetitionPower.Data.Entities;
using PetitionPower.Web.Services.Auth.Dtos;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace PetitionPower.Web.Services.Auth;

public interface IAuthService
{
    public Task<AuthResponse> LoginUser(LoginUserDto loginUserDto, CancellationToken cancellationToken, bool checkPassword = true);
    public Task<AuthResponse> RegisterUser(RegisterUserDto registerUserDto, CancellationToken cancellationToken);
    public Task<AuthResponse> Me(CancellationToken cancellationToken);
    public Task<List<UserDto>> GetUsers(CancellationToken cancellationToken);
}

public class AuthService(
    IJwtService jwtService,
    IMapper mapper,
    UserManager<UserEntity> userManager,
    ICurrentIdentity currentIdentity) : IAuthService
{
    public async Task<AuthResponse> RegisterUser(RegisterUserDto registerUserDto, CancellationToken cancellationToken)
    {
        var existingUser = await userManager.FindByEmailAsync(registerUserDto.Email);

        if (existingUser != null)
        {
            throw new BadRequestException("Користувач з таким емейлом вже існує. Спробуйте інший.");
        }

        var user = mapper.Map<UserEntity>(registerUserDto);
        user.UserName = registerUserDto.Email;
       
        var result = await userManager.CreateAsync(user, registerUserDto.Password);

        if (!result.Succeeded)
        {
            throw new BadRequestException("Щось пішло не так :(", result.Errors);
        }

        await userManager.AddToRoleAsync(user, AppConstant.Roles.User);

        var token = jwtService.GenerateToken(
            user.Id.ToString(),
            string.Join(", ", await userManager.GetRolesAsync(user)),
            AppConstant.JwtTokenLifetimes.Default);

        return new AuthResponse()
        {
            Token = token,
            User = mapper.Map<UserDto>(user)
        };
    }

    public async Task<AuthResponse> LoginUser(LoginUserDto loginUserDto, CancellationToken cancellationToken, bool checkPassword = true)
    {
        var user = await userManager.FindByEmailAsync(loginUserDto.Email) ?? throw new BadRequestException("Некоректний логін або пароль");

        if (checkPassword)
        {
            bool isPasswordValid = await userManager.CheckPasswordAsync(user, loginUserDto.Password ?? throw new BadRequestException("Некоректний логін або пароль"));

            if (!isPasswordValid)
            {
                throw new BadRequestException("Некоректний логін або пароль");
            }
        }

        TimeSpan tokenLifetime = AppConstant.JwtTokenLifetimes.Default;

        var token = jwtService.GenerateToken(
            user.Id.ToString(),
            string.Join(", ", await userManager.GetRolesAsync(user)),
            tokenLifetime);

        return new AuthResponse()
        {
            Token = token,
            User = mapper.Map<UserDto>(user)
        };
    }

    public async Task<AuthResponse> Me(CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(currentIdentity.GetUserId()) ?? throw new BadRequestException("Користувача не знайдено");

        return new AuthResponse()
        {
            Token = jwtService.GenerateToken(
                user.Id.ToString(),
                string.Join(", ", await userManager.GetRolesAsync(user)),
                AppConstant.JwtTokenLifetimes.Default),
            User = mapper.Map<UserDto>(user)
        };
    }

    public async Task<List<UserDto>> GetUsers(CancellationToken cancellationToken)
    {
        return await userManager.Users
            .ProjectTo<UserDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
