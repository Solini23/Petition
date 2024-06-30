using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using PetitionPower.Common;
using PetitionPower.Common.Exceptions;
using PetitionPower.Data;
using PetitionPower.Data.Entities;
using PetitionPower.Web.Services.Auth;
using PetitionPower.Web.Services.Common.Dtos;
using PetitionPower.Web.Services.Petition.Dtos;

namespace PetitionPower.Web.Services.Petition;

public interface IPetitionService
{
    Task<PetitionDto> CreatePetitionAsync(CreatePetitionDto createPetitionDto, CancellationToken cancellationToken);
    Task<PetitionStatisticsDto> GetPetitionStatisticsAsync(CancellationToken cancellationToken);
    Task<PagedResultDto<PetitionDto>> GetPetitionsAsync(FilteredPetitionsDto filteredPetitionsDto, CancellationToken cancellationToken);
    Task<PetitionDto> GetPetitionByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<List<CategotyDto>> GetCategoriesAsync(CancellationToken cancellationToken);
    Task<PetitionDto> UpdatePetitionAsync(UpdatePetitionDto petitionDto, CancellationToken cancellationToken);
    Task DeletePetitionAsync(Guid id, CancellationToken cancellationToken);
    Task<PetitionDto> SignPetitionAsync(Guid petitionId, CancellationToken cancellationToken);
}

public class PetitionService : IPetitionService
{
    private readonly PetitionDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICurrentIdentity _currentIdentity;

    private DbSet<PetitionEntity> Petitions => _context.Set<PetitionEntity>();
    private DbSet<SignatureEntity> Signatures => _context.Set<SignatureEntity>();
    private DbSet<CategoryEntity> Categories => _context.Set<CategoryEntity>();

    public PetitionService(PetitionDbContext context, IMapper mapper, ICurrentIdentity currentIdentity)
    {
        _context = context;
        _mapper = mapper;
        _currentIdentity = currentIdentity;
    }

    public async Task<PetitionDto> CreatePetitionAsync(CreatePetitionDto createPetitionDto, CancellationToken cancellationToken)
    {
        var petition = _mapper.Map<PetitionEntity>(createPetitionDto);
        petition.CreatedByUserId = _currentIdentity.GetUserGuid();

        petition.ExpirationDate = DateTime.UtcNow.AddDays(AppConstant.MaxDaysToCollectSignatures);
        petition.RequiredSignatures = AppConstant.MinSignaturesCount;

        Petitions.Add(petition);
        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<PetitionDto>(petition);
    }

    public async Task<PetitionStatisticsDto> GetPetitionStatisticsAsync(CancellationToken cancellationToken)
    {
        var totalPetitions = await Petitions.CountAsync(cancellationToken);
        var totalSignatures = await Signatures.CountAsync(cancellationToken);
        var successfulPetitions = await Petitions.CountAsync(p => p.Signatures.Count >= p.RequiredSignatures, cancellationToken);
        var failedPetitions = await Petitions.CountAsync(p => p.Signatures.Count < p.RequiredSignatures && p.ExpirationDate < DateTime.UtcNow, cancellationToken);

        var createdPetitionsByDay = await Petitions
            .GroupBy(p => p.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var signedPetitionsByDay = await Signatures
            .GroupBy(s => s.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var expiredPetitionsByDay = await Petitions
            .Where(p => p.ExpirationDate < DateTime.UtcNow)
            .GroupBy(p => p.ExpirationDate.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        return new PetitionStatisticsDto
        {
            TotalPetitions = totalPetitions,
            TotalSignatures = totalSignatures,
            SuccessfulPetitions = successfulPetitions,
            FailedPetitions = failedPetitions,
            CreatedPetitionsByDay = createdPetitionsByDay.ToDictionary(x => x.Date, x => x.Count),
            SignedPetitionsByDay = signedPetitionsByDay.ToDictionary(x => x.Date, x => x.Count),
            ExpiredPetitionsByDay = expiredPetitionsByDay.ToDictionary(x => x.Date, x => x.Count)
        };
    }


    public async Task<PagedResultDto<PetitionDto>> GetPetitionsAsync(FilteredPetitionsDto filteredPetitionsDto, CancellationToken cancellationToken)
    {
        var query = Petitions.AsQueryable();

        if(!string.IsNullOrEmpty(filteredPetitionsDto.SearchTerm))
        {
            query = query.Where(p => 
                p.Title.Contains(filteredPetitionsDto.SearchTerm) || 
                p.Description.Contains(filteredPetitionsDto.SearchTerm));
        }

        if (filteredPetitionsDto.UserId.HasValue)
        {
            query = query.Where(p => p.CreatedByUserId == filteredPetitionsDto.UserId);
        }

        if (filteredPetitionsDto.IsSuccessful.HasValue)
        {
            query = query.Where(p => p.Signatures.Count >= p.RequiredSignatures);
        }

        if (filteredPetitionsDto.IsExpired.HasValue)
        {
            query = query.Where(p => p.ExpirationDate < DateTime.UtcNow);
        }

        if (filteredPetitionsDto.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == filteredPetitionsDto.CategoryId);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var petitions = await query
            .Skip((filteredPetitionsDto.Page - 1) * filteredPetitionsDto.PageSize)
            .Take(filteredPetitionsDto.PageSize)
            .Include(p => p.Category)
            .Include(p => p.CreatedByUser)
            .Include(p => p.Signatures)
                .ThenInclude(s => s.SignedByUser)
            .ProjectTo<PetitionDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new PagedResultDto<PetitionDto>(filteredPetitionsDto.Page, filteredPetitionsDto.PageSize, totalCount, petitions);
    }

    public async Task<PetitionDto> GetPetitionByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var petition = await Petitions
            .Include(p => p.Category)
            .Include(p => p.CreatedByUser)
            .Include(p => p.Signatures)
                .ThenInclude(s => s.SignedByUser)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken)
            ?? throw new KeyNotFoundException("Петицію не знайдено");

        return _mapper.Map<PetitionDto>(petition);
    }

    public async Task<PetitionDto> UpdatePetitionAsync(UpdatePetitionDto petitionDto, CancellationToken cancellationToken)
    {
        var petition = await Petitions.FindAsync([petitionDto.Id], cancellationToken)
            ?? throw new KeyNotFoundException("Петицію не знайдено");

        if (petition.CreatedByUserId != _currentIdentity.GetUserGuid())
        {
            throw new ForbiddenException("Ви не маєте права редагувати цю петицію");
        }

        petition.CategoryId = petitionDto.CategoryId;
        petition.Description = petitionDto.Description;
        petition.ExpirationDate = petitionDto.ExpirationDate;
        petition.RequiredSignatures = petitionDto.RequiredSignatures;
        petition.Title = petitionDto.Title;

        Petitions.Update(petition);

        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<PetitionDto>(petition);
    }

    public async Task DeletePetitionAsync(Guid id, CancellationToken cancellationToken)
    {
        var petition = await Petitions.FindAsync([id], cancellationToken)
            ?? throw new BadRequestException("Петицію не знайдено");

        if (petition.CreatedByUserId != _currentIdentity.GetUserGuid())
        {
            throw new ForbiddenException("Ви не маєте права видаляти цю петицію");
        }

        var signatures = await Signatures.Where(s => s.PetitionId == id).ToListAsync(cancellationToken);
        Signatures.RemoveRange(signatures);

        Petitions.Remove(petition);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<CategotyDto>> GetCategoriesAsync(CancellationToken cancellationToken)
    {
        return await Categories
            .ProjectTo<CategotyDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }

    public async Task<PetitionDto> SignPetitionAsync(Guid petitionId, CancellationToken cancellationToken)
    {
        var petition = await Petitions
            .Include(p => p.Signatures)
            .FirstOrDefaultAsync(p => p.Id == petitionId, cancellationToken)
            ?? throw new KeyNotFoundException("Петицію не знайдено");

        if (petition.Signatures.Any(s => s.SignedByUserId == _currentIdentity.GetUserGuid()))
        {
            throw new BadRequestException("Ви вже підписали цю петицію");
        }

        var user = await _context.Users.FindAsync(_currentIdentity.GetUserGuid(), cancellationToken)
            ?? throw new KeyNotFoundException("Користувача не знайдено");

        var signature = new SignatureEntity
        {
            Petition = petition,
            SignedByUser = user
        };

        Signatures.Add(signature);
        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<PetitionDto>(petition);
    }
}
