using API.Data.SeedData;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data;

public class Seed
{
    public static async Task SeedFoundationAsync(
        DataContext context,
        UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager)
    {
        await SeedUsers.SeedAsync(userManager, roleManager, context);
        await SeedProductCatalog.SeedAsync(context);
        await SeedStorefrontContent.SeedAsync(context);
    }
}