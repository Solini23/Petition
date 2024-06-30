using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Writers;
using PetitionPower.Data;
using PetitionPower.Data.Entities;
using PetitionPower.Web;
using PetitionPower.Web.Extensions;
using PetitionPower.Web.Middlewares;
using PetitionPower.Web.Services.Auth;
using PetitionPower.Web.Services.Common;
using PetitionPower.Web.Services.Petition;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<PetitionDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServer")));

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ICurrentIdentity, CurrentIdentity>();

builder.Services.AddScoped<IOAuthService, OAuthService>();
builder.Services.AddScoped<IFacebookAuthService, FacebookAuthService>();
builder.Services.AddScoped<IHttpClientService, HttpClientService>();
builder.Services.AddScoped<IPetitionService, PetitionService>();

builder.Services.AddMvc();
builder.Services.AddSession();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy
        .WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
    );
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();
builder.Services.AddIdentity<UserEntity, RoleEntity>()
    .AddEntityFrameworkStores<PetitionDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    // to ingore loop inside entities that reference each other
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);

builder.Services.AddBearer(builder.Configuration["Jwt:Secret"] ?? throw new Exception("Jwt Secret does not exist"));
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwagger();

var app = builder.Build();

await app.MigrateDatabaseAsync();
await app.SeedData();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

app.MapControllers();

app.Run();
