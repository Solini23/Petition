using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetitionPower.Web.Services.Petition.Dtos;
using PetitionPower.Web.Services.Petition;
using PetitionPower.Web.Services.Common.Dtos;

namespace PetitionPower.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PetitionController : ControllerBase
{
    private readonly IPetitionService _petitionService;

    public PetitionController(IPetitionService petitionService)
    {
        _petitionService = petitionService;
    }

    [HttpPost("create")]
    [Authorize]
    public async Task<ActionResult<PetitionDto>> CreatePetition([FromBody] CreatePetitionDto createPetitionDto, CancellationToken cancellationToken)
    {
        return await _petitionService.CreatePetitionAsync(createPetitionDto, cancellationToken);
    }

    [Authorize]
    [HttpGet("statistics")]
    public async Task<ActionResult<PetitionStatisticsDto>> GetStatistics(CancellationToken cancellationToken)
    {
        return await _petitionService.GetPetitionStatisticsAsync(cancellationToken);
    }

    [Authorize]
    [HttpGet("all-categories")]
    public async Task<ActionResult<List<CategotyDto>>> GetCategories(CancellationToken cancellationToken)
    {
        return await _petitionService.GetCategoriesAsync(cancellationToken);
    }

    [Authorize]
    [HttpGet("all-petitions")]
    public async Task<ActionResult<PagedResultDto<PetitionDto>>> GetPetitions([FromQuery] FilteredPetitionsDto filteredPetitionsDto, CancellationToken cancellationToken)
    {
        return await _petitionService.GetPetitionsAsync(filteredPetitionsDto, cancellationToken);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<PetitionDto>> GetPetitionById(Guid id, CancellationToken cancellationToken)
    {
        return await _petitionService.GetPetitionByIdAsync(id, cancellationToken);
    }

    [Authorize]
    [HttpPut("update")]
    public async Task<ActionResult<PetitionDto>> UpdatePetition([FromBody] UpdatePetitionDto petitionDto, CancellationToken cancellationToken)
    {
        return await _petitionService.UpdatePetitionAsync(petitionDto, cancellationToken);
    }

    [Authorize]
    [HttpDelete("delete/{id}")]
    public async Task DeletePetition(Guid id, CancellationToken cancellationToken)
    {
        await _petitionService.DeletePetitionAsync(id, cancellationToken);
    }

    [Authorize]
    [HttpPost("sign/{id}")]
    public async Task<ActionResult<PetitionDto>> SignPetition(Guid id, CancellationToken cancellationToken)
    {
        return await _petitionService.SignPetitionAsync(id, cancellationToken);
    }
}