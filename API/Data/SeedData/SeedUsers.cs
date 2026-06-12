using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data.SeedData;

public static class SeedUsers
{
    // ===============================
    // Seed users and roles
    // Creates the ecommerce roles and starter users.
    // Roles stay here because seeded users need roles immediately.
    // ===============================
    public static async Task SeedAsync(
        UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager,
        DataContext context)
    {
        var roles = new List<string> { "Admin", "Customer" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new AppRole { Name = role });
            }
        }

        if (await userManager.Users.AnyAsync())
            return;

        var users = new List<(AppUser User, string Password, string Role)>
        {
            (
                new AppUser
                {
                    FirstName = "Elsie",
                    LastName = "Dev",
                    UserName = "komazi.zbe.dev@gmail.com",
                    Email = "komazi.zbe.dev@gmail.com",
                    NormalizedUserName = "KOMAZI.ZBE.DEV@GMAIL.COM",
                    NormalizedEmail = "KOMAZI.ZBE.DEV@GMAIL.COM",
                    JoinDate = DateOnly.FromDateTime(DateTime.UtcNow)
                },
                "Password@1",
                "Admin"
            ),
            (
                new AppUser
                {
                    FirstName = "Bridgette",
                    LastName = "Komazi",
                    UserName = "2019098256@ufs4life.ac.za",
                    Email = "2019098256@ufs4life.ac.za",
                    NormalizedUserName = "2019098256@UFS4LIFE.AC.ZA",
                    NormalizedEmail = "2019098256@UFS4LIFE.AC.ZA",
                    JoinDate = DateOnly.FromDateTime(DateTime.UtcNow)
                },
                "Password@1",
                "Admin"
            ),
            (
                new AppUser
                {
                    FirstName = "Zintle",
                    LastName = "Komazi",
                    UserName = "komazib@gmail.com",
                    Email = "komazib@gmail.com",
                    NormalizedUserName = "KOMAZIB@GMAIL.COM",
                    NormalizedEmail = "KOMAZIB@GMAIL.COM",
                    JoinDate = DateOnly.FromDateTime(DateTime.UtcNow)
                },
                "Password@1",
                "Customer"
            ),
            (
                new AppUser
                {
                    FirstName = "Leah",
                    LastName = "Stone",
                    UserName = "backup2019098256ufs@gmail.com",
                    Email = "backup2019098256ufs@gmail.com",
                    NormalizedUserName = "BACKUP2019098256UFS@GMAIL.COM",
                    NormalizedEmail = "BACKUP2019098256UFS@GMAIL.COM",
                    JoinDate = DateOnly.FromDateTime(DateTime.UtcNow)
                },
                "Password@1",
                "Customer"
            ),
            (
                new AppUser
                {
                    FirstName = "Sienna",
                    LastName = "Vale",
                    UserName = "komazielsie.forex@gmail.com",
                    Email = "komazielsie.forex@gmail.com",
                    NormalizedUserName = "KOMAZIELSIE.FOREX@GMAIL.COM",
                    NormalizedEmail = "KOMAZIELSIE.FOREX@GMAIL.COM",
                    JoinDate = DateOnly.FromDateTime(DateTime.UtcNow)
                },
                "Password@1",
                "Customer"
            ),
            (
                new AppUser
                {
                    FirstName = "Cesara",
                    LastName = "Ndlovu",
                    UserName = "cesarandlovu@gmail.com",
                    Email = "cesarandlovu@gmail.com",
                    NormalizedUserName = "CESARANDLOVU@GMAIL.COM",
                    NormalizedEmail = "CESARANDLOVU@GMAIL.COM",
                    JoinDate = DateOnly.FromDateTime(DateTime.UtcNow)
                },
                "Password@1",
                "Customer"
            )
        };

        foreach (var seedUser in users)
        {
            var existingUser = await userManager.FindByEmailAsync(seedUser.User.Email!);

            if (existingUser != null)
                continue;

            var result = await userManager.CreateAsync(seedUser.User, seedUser.Password);

            if (!result.Succeeded)
                continue;

            await userManager.AddToRoleAsync(seedUser.User, seedUser.Role);
        }

        await context.SaveChangesAsync();
    }
}