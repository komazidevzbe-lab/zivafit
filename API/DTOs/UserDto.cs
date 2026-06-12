namespace API.DTOs;

public class UserDto
{
    public string UserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public string[] Roles { get; set; } = Array.Empty<string>();
    public DateOnly? JoinDate { get; set; }
}