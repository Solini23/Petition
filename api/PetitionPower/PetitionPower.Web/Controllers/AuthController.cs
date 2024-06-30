using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetitionPower.Web.Services.Auth.Dtos;
using PetitionPower.Web.Services.Auth;

namespace PetitionPower.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<AuthResponse> Register([FromBody] RegisterUserDto registerUserDto, CancellationToken cancellationToken)
    {
        return await authService.RegisterUser(registerUserDto, cancellationToken);
    }

    [HttpPost("login")]
    public async Task<AuthResponse> Login([FromBody] LoginUserDto loginUserDto, CancellationToken cancellationToken)
    {
        return await authService.LoginUser(loginUserDto, cancellationToken);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<AuthResponse> Me(CancellationToken cancellationToken)
    {
        return await authService.Me(cancellationToken);
    }

    [Authorize]
    [HttpGet("users")]
    public async Task<List<UserDto>> GetUsers(CancellationToken cancellationToken)
    {
        return await authService.GetUsers(cancellationToken);
    }
}

