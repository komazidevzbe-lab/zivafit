using API.Data.SeedData;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data;

public class Seed
{
    // ===============================
    // Seed foundation
    // Runs the foundation seed files in the correct order.
    // For now, this seeds users and roles only.
    // ===============================
    public static async Task SeedFoundationAsync(
        DataContext context,
        UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager)
    {
        await SeedUsers.SeedAsync(userManager, roleManager, context);
    }
}