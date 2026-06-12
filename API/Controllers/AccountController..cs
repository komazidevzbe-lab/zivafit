using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(
    UserManager<AppUser> userManager,
    ITokenService tokenService,
    IPasswordResetCodeService passwordResetCodeService
) : BaseApiController
{
    // ===============================
    // Register customer
    // Creates a normal customer account.
    // Public browsing does not require this, but checkout/wishlist/orders will.
    // ===============================
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        var errors = new Dictionary<string, string>();

        var firstName = registerDto.FirstName?.Trim();
        var lastName = registerDto.LastName?.Trim();
        var emailLower = registerDto.Email?.Trim().ToLowerInvariant();

        var firstNameError = ValidateName(firstName, "First name");
        if (firstNameError != null)
            errors["firstName"] = firstNameError;

        var lastNameError = ValidateName(lastName, "Last name");
        if (lastNameError != null)
            errors["lastName"] = lastNameError;

        var emailError = ValidateEmail(emailLower);
        if (emailError != null)
            errors["email"] = emailError;

        var passwordError = ValidatePassword(registerDto.Password, "Password");
        if (passwordError != null)
            errors["password"] = passwordError;

        if (string.IsNullOrWhiteSpace(registerDto.ConfirmPassword))
            errors["confirmPassword"] = "Confirm password is required.";
        else if (registerDto.Password != registerDto.ConfirmPassword)
            errors["confirmPassword"] = "Passwords do not match.";

        if (errors.Count > 0)
            return BadRequest(errors);

        var existingUser = await userManager.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.NormalizedEmail == emailLower!.ToUpperInvariant());

        if (existingUser != null)
            return Conflict(new { message = $"An account already exists with email '{emailLower}'." });

        var user = new AppUser
        {
            FirstName = firstName!,
            LastName = lastName!,
            UserName = emailLower,
            Email = emailLower,
            NormalizedEmail = emailLower!.ToUpperInvariant(),
            NormalizedUserName = emailLower.ToUpperInvariant(),
            JoinDate = DateOnly.FromDateTime(DateTime.UtcNow)
        };

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
            return BadRequest(new { message = "Failed to create account.", errors = result.Errors });

        await userManager.AddToRoleAsync(user, "Customer");

        var roles = await userManager.GetRolesAsync(user);

        return new UserDto
        {
            UserName = user.UserName ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email ?? string.Empty,
            Roles = roles.ToArray(),
            Token = await tokenService.CreateToken(user),
            JoinDate = user.JoinDate
        };
    }

    // ===============================
    // Login
    // Customers and admins both log in with email and password.
    // ===============================
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var errors = new Dictionary<string, string>();

        var emailLower = loginDto.Email?.Trim().ToLowerInvariant();

        var emailError = ValidateEmail(emailLower);
        if (emailError != null)
        {
            errors["email"] = emailError;
            return Unauthorized(errors);
        }

        if (string.IsNullOrWhiteSpace(loginDto.Password))
        {
            errors["password"] = "Password is required.";
            return Unauthorized(errors);
        }

        var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.NormalizedEmail == emailLower!.ToUpperInvariant());

        if (user == null)
        {
            errors["email"] = "Email not found.";
            return Unauthorized(errors);
        }

        var passwordValid = await userManager.CheckPasswordAsync(user, loginDto.Password);

        if (!passwordValid)
        {
            errors["password"] = "Invalid password.";
            return Unauthorized(errors);
        }

        var roles = await userManager.GetRolesAsync(user);

        return new UserDto
        {
            UserName = user.UserName ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email ?? string.Empty,
            Roles = roles.ToArray(),
            Token = await tokenService.CreateToken(user),
            JoinDate = user.JoinDate
        };
    }

    // ===============================
    // Current user
    // Returns the logged-in user's latest Identity details.
    // Used when Angular restores the session from token storage.
    // ===============================
    [Authorize]
    [HttpGet("current-user")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var email = User.GetEmail();

        var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.NormalizedEmail == email.ToUpperInvariant());

        if (user == null)
            return Unauthorized();

        var roles = await userManager.GetRolesAsync(user);

        return new UserDto
        {
            UserName = user.UserName ?? string.Empty,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email ?? string.Empty,
            Roles = roles.ToArray(),
            Token = await tokenService.CreateToken(user),
            JoinDate = user.JoinDate
        };
    }

    // ===============================
    // Forgot password
    // Generates a secure reset code, hashes it, saves it, and emails it.
    // The API never returns the reset code in the response.
    // ===============================
    [HttpPost("forgot-password")]
    public async Task<ActionResult> ForgotPassword(ForgotPasswordDto dto)
    {
        var emailLower = dto.Email?.Trim().ToLowerInvariant();

        var emailError = ValidateEmail(emailLower);
        if (emailError != null)
            return BadRequest(new { email = emailError });

        var safeMessage = new
        {
            message = "If an account with that email exists, a reset code has been sent."
        };

        var user = await userManager.FindByEmailAsync(emailLower!);

        if (user == null)
            return Ok(safeMessage);

        await passwordResetCodeService.GenerateAndSendResetCodeAsync(user);

        return Ok(safeMessage);
    }

    // ===============================
    // Verify reset code
    // Checks if the reset code entered by the user is valid.
    // Used before showing the final new-password form.
    // ===============================
    [HttpPost("verify-reset-code")]
    public async Task<ActionResult> VerifyResetCode(VerifyResetCodeDto dto)
    {
        var errors = new Dictionary<string, string>();

        var emailLower = dto.Email?.Trim().ToLowerInvariant();

        var emailError = ValidateEmail(emailLower);
        if (emailError != null)
            errors["email"] = emailError;

        if (string.IsNullOrWhiteSpace(dto.Code))
            errors["code"] = "Reset code is required.";

        if (errors.Count > 0)
            return BadRequest(errors);

        var user = await userManager.FindByEmailAsync(emailLower!);

        if (user == null)
            return BadRequest(new { message = "Invalid or expired reset code." });

        var isValid = await passwordResetCodeService.VerifyResetCodeAsync(user, dto.Code);

        if (!isValid)
            return BadRequest(new { message = "Invalid or expired reset code." });

        return Ok(new { message = "Code verified successfully." });
    }

    // ===============================
    // Reset password
    // Resets the password after validating the emailed reset code.
    // Password and confirm password must match.
    // ===============================
    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword(ResetPasswordDto dto)
    {
        var errors = new Dictionary<string, string>();

        var emailLower = dto.Email?.Trim().ToLowerInvariant();

        var emailError = ValidateEmail(emailLower);
        if (emailError != null)
            errors["email"] = emailError;

        if (string.IsNullOrWhiteSpace(dto.Code))
            errors["code"] = "Reset code is required.";

        var passwordError = ValidatePassword(dto.Password, "Password");
        if (passwordError != null)
            errors["password"] = passwordError;

        if (string.IsNullOrWhiteSpace(dto.ConfirmPassword))
            errors["confirmPassword"] = "Confirm password is required.";
        else if (dto.Password != dto.ConfirmPassword)
            errors["confirmPassword"] = "Passwords do not match.";

        if (errors.Count > 0)
            return BadRequest(errors);

        var user = await userManager.FindByEmailAsync(emailLower!);

        if (user == null)
            return BadRequest(new { message = "Invalid password reset request." });

        var isValidCode = await passwordResetCodeService.VerifyResetCodeAsync(user, dto.Code);

        if (!isValidCode)
            return BadRequest(new { message = "Invalid or expired reset code." });

        var identityResetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        var result = await userManager.ResetPasswordAsync(user, identityResetToken, dto.Password);

        if (!result.Succeeded)
            return BadRequest(new { message = "Failed to reset password.", errors = result.Errors });

        await passwordResetCodeService.MarkResetCodeAsUsedAsync(user, dto.Code);

        return Ok(new { message = "Password reset successfully." });
    }

    // ===============================
    // Logout
    // JWT logout happens on the client by clearing the stored token.
    // ===============================
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok(new { message = "Logged out. Client must clear token." });
    }

    // ===============================
    // Validate name
    // First name and last name must contain letters only.
    // Spaces are allowed for double names.
    // ===============================
    private static string? ValidateName(string? value, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
            return $"{fieldName} is required.";

        if (!Regex.IsMatch(value, @"^[A-Za-z]+(?:\s[A-Za-z]+)*$"))
            return $"{fieldName} must contain letters only.";

        return null;
    }

    // ===============================
    // Validate email
    // Email must be valid and must use an allowed email ending.
    // ===============================
    private static string? ValidateEmail(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return "Email is required.";

        var emailValidator = new EmailAddressAttribute();

        if (!emailValidator.IsValid(email))
            return "Email address is not valid.";

        if (!IsAllowedEmailDomain(email))
        {
            return "Email must end with @gmail.com, @icloud.com, .co.za, .org, .gov, .edu, or .ac.za.";
        }

        return null;
    }

    // ===============================
    // Allowed email domains
    // Defines the email endings allowed for ZIVA Active accounts.
    // ===============================
    private static bool IsAllowedEmailDomain(string email)
    {
        var allowedEndings = new[]
        {
            "@gmail.com",
            "@icloud.com",
            ".co.za",
            ".org",
            ".gov",
            ".edu",
            ".ac.za"
        };

        return allowedEndings.Any(ending =>
            email.EndsWith(ending, StringComparison.OrdinalIgnoreCase));
    }

    // ===============================
    // Validate password
    // Password must follow the ZIVA Active password rules.
    // ===============================
    private static string? ValidatePassword(string? password, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(password))
            return $"{fieldName} is required.";

        if (password.Length < 6)
            return $"{fieldName} must be at least 6 characters long.";

        if (!password.Any(char.IsUpper))
            return $"{fieldName} must contain at least one uppercase letter.";

        if (!password.Any(char.IsLower))
            return $"{fieldName} must contain at least one lowercase letter.";

        if (!password.Any(char.IsDigit))
            return $"{fieldName} must contain at least one number.";

        if (!password.Any(ch => !char.IsLetterOrDigit(ch)))
            return $"{fieldName} must contain at least one symbol.";

        return null;
    }
}