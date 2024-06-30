using Microsoft.EntityFrameworkCore;
using PetitionPower.Data;

namespace PetitionPower.Web.Extensions;

public static class DatabaseExtensions
{
    public static async Task MigrateDatabaseAsync(this IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();

        var services = serviceScope.ServiceProvider;
        var dbContext = services.GetRequiredService<PetitionDbContext>();

        await dbContext.Database.MigrateAsync();
    }
}