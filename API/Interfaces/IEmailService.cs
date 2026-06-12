namespace API.Interfaces;

public interface IEmailService
{
    Task SendPasswordResetCodeAsync(string toEmail, string fullName, string resetCode);
}