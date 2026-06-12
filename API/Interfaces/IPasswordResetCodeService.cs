using API.Entities;

namespace API.Interfaces;

public interface IPasswordResetCodeService
{
    Task GenerateAndSendResetCodeAsync(AppUser user);
    Task<bool> VerifyResetCodeAsync(AppUser user, string code);
    Task MarkResetCodeAsUsedAsync(AppUser user, string code);
}