namespace API.Entities;

public class PasswordResetCode
{
    public int Id { get; set; }

    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;

    public string CodeHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }

    public bool IsUsed { get; set; }
    public DateTime? UsedAt { get; set; }
}