namespace TextileOasis.Infrastructure.Security;

public class EmailSettings
{
    public string Host { get; set; } = "smtp.gmail.com";
    public int Port { get; set; } = 587;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = "Corporación Textil Salas";
    public string SalesEmail { get; set; } = string.Empty;
    public bool EnableSsl { get; set; } = true;
}
