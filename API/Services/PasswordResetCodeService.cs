using System.Security.Cryptography;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class PasswordResetCodeService(
    DataContext context,
    IEmailService emailService
) : IPasswordResetCodeService
{
    private readonly PasswordHasher<PasswordResetCode> _passwordHasher = new();

    // ===============================
    // Generate and send reset code
    // Creates a random code, hashes it, stores it, and emails the plain code.
    // The plain code is never saved in the database.
    // ===============================
    public async Task GenerateAndSendResetCodeAsync(AppUser user)
    {
        await ExpireExistingCodesAsync(user.Id);

        var plainCode = GenerateResetCode();

        var resetCode = new PasswordResetCode
        {
            AppUserId = user.Id,
            CodeHash = string.Empty,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15),
            IsUsed = false
        };

        resetCode.CodeHash = _passwordHasher.HashPassword(resetCode, plainCode);

        context.PasswordResetCodes.Add(resetCode);

        await context.SaveChangesAsync();

        var fullName = $"{user.FirstName} {user.LastName}".Trim();

        await emailService.SendPasswordResetCodeAsync(
            user.Email ?? string.Empty,
            fullName,
            plainCode
        );
    }

    // ===============================
    // Verify reset code
    // Checks the entered code against the hashed reset code in the database.
    // ===============================
    public async Task<bool> VerifyResetCodeAsync(AppUser user, string code)
    {
        if (string.IsNullOrWhiteSpace(code))
            return false;

        var resetCodes = await context.PasswordResetCodes
            .Where(rc =>
                rc.AppUserId == user.Id &&
                !rc.IsUsed &&
                rc.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(rc => rc.CreatedAt)
            .ToListAsync();

        foreach (var resetCode in resetCodes)
        {
            var result = _passwordHasher.VerifyHashedPassword(
                resetCode,
                resetCode.CodeHash,
                code.Trim()
            );

            if (result != PasswordVerificationResult.Failed)
                return true;
        }

        return false;
    }

    // ===============================
    // Mark reset code as used
    // Prevents the same reset code from being reused after password reset.
    // ===============================
    public async Task MarkResetCodeAsUsedAsync(AppUser user, string code)
    {
        var resetCodes = await context.PasswordResetCodes
            .Where(rc =>
                rc.AppUserId == user.Id &&
                !rc.IsUsed &&
                rc.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(rc => rc.CreatedAt)
            .ToListAsync();

        foreach (var resetCode in resetCodes)
        {
            var result = _passwordHasher.VerifyHashedPassword(
                resetCode,
                resetCode.CodeHash,
                code.Trim()
            );

            if (result == PasswordVerificationResult.Failed)
                continue;

            resetCode.IsUsed = true;
            resetCode.UsedAt = DateTime.UtcNow;

            await context.SaveChangesAsync();

            return;
        }
    }

    // ===============================
    // Expire existing codes
    // Marks older unused reset codes as used before creating a new one.
    // This keeps only the latest reset code active.
    // ===============================
    private async Task ExpireExistingCodesAsync(int userId)
    {
        var existingCodes = await context.PasswordResetCodes
            .Where(rc => rc.AppUserId == userId && !rc.IsUsed)
            .ToListAsync();

        foreach (var existingCode in existingCodes)
        {
            existingCode.IsUsed = true;
            existingCode.UsedAt = DateTime.UtcNow;
        }

        await context.SaveChangesAsync();
    }

    // ===============================
    // Generate reset code
    // Creates a code with letters, numbers, and symbols.
    // ===============================
    private static string GenerateResetCode()
    {
        const string letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        const string numbers = "23456789";
        const string symbols = "!@#$%";

        var codeCharacters = new List<char>
        {
            GetRandomCharacter(letters),
            GetRandomCharacter(numbers),
            GetRandomCharacter(symbols)
        };

        var allCharacters = letters + numbers + symbols;

        while (codeCharacters.Count < 10)
        {
            codeCharacters.Add(GetRandomCharacter(allCharacters));
        }

        return new string(codeCharacters
            .OrderBy(_ => RandomNumberGenerator.GetInt32(0, int.MaxValue))
            .ToArray());
    }

    // ===============================
    // Get random character
    // Uses a cryptographically secure random number generator.
    // ===============================
    private static char GetRandomCharacter(string characters)
    {
        var index = RandomNumberGenerator.GetInt32(characters.Length);
        return characters[index];
    }
}