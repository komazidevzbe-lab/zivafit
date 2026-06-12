using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireAdminRole")]
public class AdminController(
    UserManager<AppUser> userManager,
    RoleManager<AppRole> roleManager
) : BaseApiController
{
    // ===============================
    // Admin check
    // Simple protected endpoint to confirm Admin authorization is working.
    // ===============================
    [HttpGet("admin-check")]
    public ActionResult AdminCheck()
    {
        return Ok(new { message = "Admin access confirmed." });
    }

    // ===============================
    // Users with roles
    // Returns all users with their assigned roles.
    // Used later by admin customer/user management.
    // ===============================
    [HttpGet("users-with-roles")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersWithRoles()
    {
        var users = await userManager.Users
            .AsNoTracking()
            .OrderBy(u => u.Email)
            .ToListAsync();

        var result = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);

            result.Add(new UserDto
            {
                UserName = user.UserName ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? string.Empty,
                Roles = roles.ToArray(),
                Token = string.Empty,
                JoinDate = user.JoinDate
            });
        }

        return Ok(result);
    }

    // ===============================
    // Customers
    // Returns users in the Customer role.
    // This will support the Customer Management admin page later.
    // ===============================
    [HttpGet("customers")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetCustomers()
    {
        var customers = await userManager.GetUsersInRoleAsync("Customer");
        var result = new List<UserDto>();

        foreach (var customer in customers.OrderBy(c => c.Email))
        {
            var roles = await userManager.GetRolesAsync(customer);

            result.Add(new UserDto
            {
                UserName = customer.UserName ?? string.Empty,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email ?? string.Empty,
                Roles = roles.ToArray(),
                Token = string.Empty,
                JoinDate = customer.JoinDate
            });
        }

        return Ok(result);
    }

    // ===============================
    // Update roles
    // Updates roles for a user by email.
    // Keeps role management in the AdminController like the portal pattern.
    // ===============================
    [HttpPut("update-roles/{email}")]
    public async Task<ActionResult> UpdateRoles(string email, List<string> roles)
    {
        var emailLower = email?.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(emailLower))
            return BadRequest(new { message = "Email is required." });

        if (roles == null || roles.Count == 0)
            return BadRequest(new { message = "At least one role is required." });

        var user = await userManager.FindByEmailAsync(emailLower);

        if (user == null)
            return NotFound(new { message = "User not found." });

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                return BadRequest(new { message = $"Role '{role}' does not exist." });
        }

        var currentRoles = await userManager.GetRolesAsync(user);

        var removeResult = await userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeResult.Succeeded)
            return BadRequest(new { message = "Failed to remove current roles.", errors = removeResult.Errors });

        var addResult = await userManager.AddToRolesAsync(user, roles);
        if (!addResult.Succeeded)
            return BadRequest(new { message = "Failed to add new roles.", errors = addResult.Errors });

        return Ok(new { message = "Roles updated successfully." });
    }

    // ===============================
    // Delete user
    // Deletes a user by email.
    // Later we can change this to deactivate accounts instead of deleting.
    // ===============================
    [HttpDelete("delete-user/{email}")]
    public async Task<ActionResult> DeleteUser(string email)
    {
        var emailLower = email?.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(emailLower))
            return BadRequest(new { message = "Email is required." });

        var user = await userManager.FindByEmailAsync(emailLower);

        if (user == null)
            return NotFound(new { message = "User not found." });

        var result = await userManager.DeleteAsync(user);

        if (!result.Succeeded)
            return BadRequest(new { message = "Failed to delete user.", errors = result.Errors });

        return Ok(new { message = "User deleted successfully." });
    }
}