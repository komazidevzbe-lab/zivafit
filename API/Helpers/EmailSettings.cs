namespace API.Helpers;

public class EmailSettings
{
    public string SmtpServer { get; set; } = string.Empty;
    public int Port { get; set; }
    public bool EnableSsl { get; set; }

    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;
    public string AppPassword { get; set; } = string.Empty;
}