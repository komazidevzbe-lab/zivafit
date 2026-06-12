using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Entities;

[Index(nameof(UserName), IsUnique = true)]
public class AppUser : IdentityUser<int>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public DateOnly? JoinDate { get; set; }

    public ICollection<AppUserRole> UserRoles { get; set; } = new List<AppUserRole>();
}