using System.Net;
using System.Net.Mail;
using API.Helpers;
using API.Interfaces;
using Microsoft.Extensions.Options;

namespace API.Services;

public class EmailService(IOptions<EmailSettings> emailOptions) : IEmailService
{
    private readonly EmailSettings _emailSettings = emailOptions.Value;

    // ===============================
    // Send password reset code
    // Sends the reset code to the user's email using Gmail SMTP.
    // The code is only sent by email and is never returned by the API.
    // ===============================
    public async Task SendPasswordResetCodeAsync(string toEmail, string fullName, string resetCode)
    {
        ValidateEmailSettings();

        using var message = new MailMessage
        {
            From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
            Subject = "Your ZIVA Active password reset code",
            Body = BuildPasswordResetEmailBody(fullName, resetCode),
            IsBodyHtml = false
        };

        message.To.Add(toEmail);

        using var smtpClient = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.Port)
        {
            EnableSsl = _emailSettings.EnableSsl,
            Credentials = new NetworkCredential(_emailSettings.UserName, _emailSettings.AppPassword)
        };

        await smtpClient.SendMailAsync(message);
    }

    // ===============================
    // Validate email settings
    // Prevents silent email failures when SMTP settings are missing.
    // ===============================
    private void ValidateEmailSettings()
    {
        if (string.IsNullOrWhiteSpace(_emailSettings.SmtpServer))
            throw new Exception("Email setting SmtpServer is missing.");

        if (_emailSettings.Port <= 0)
            throw new Exception("Email setting Port is missing.");

        if (string.IsNullOrWhiteSpace(_emailSettings.FromEmail))
            throw new Exception("Email setting FromEmail is missing.");

        if (string.IsNullOrWhiteSpace(_emailSettings.FromName))
            throw new Exception("Email setting FromName is missing.");

        if (string.IsNullOrWhiteSpace(_emailSettings.UserName))
            throw new Exception("Email setting UserName is missing.");

        if (string.IsNullOrWhiteSpace(_emailSettings.AppPassword))
            throw new Exception("Email setting AppPassword is missing.");
    }

    // ===============================
    // Build password reset email body
    // Keeps the reset email message in one place.
    // ===============================
    private static string BuildPasswordResetEmailBody(string fullName, string resetCode)
    {
        return $"""
        Hi {fullName},

        We received a request to reset your ZIVA Active password.

        Your password reset code is:

        {resetCode}

        This code will expire in 15 minutes.

        If you did not request a password reset, you can ignore this email.

        ZIVA Active
        """;
    }
}