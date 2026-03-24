using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace TextileOasis.Infrastructure.Security;

public class EmailSender
{
    private readonly EmailSettings _settings;

    public EmailSender(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public bool IsConfigured => !string.IsNullOrWhiteSpace(_settings.Username)
        && !string.IsNullOrWhiteSpace(_settings.Password)
        && !string.IsNullOrWhiteSpace(_settings.FromEmail);

    public async Task SendAsync(string to, string subject, string htmlBody)
    {
        if (!IsConfigured)
            throw new InvalidOperationException("SMTP no configurado. Completa EmailSettings en appsettings.json con tu Gmail y App Password.");

        using var client = new SmtpClient(_settings.Host, _settings.Port)
        {
            Credentials = new NetworkCredential(_settings.Username, _settings.Password),
            EnableSsl = _settings.EnableSsl,
        };

        using var message = new MailMessage
        {
            From = new MailAddress(_settings.FromEmail, _settings.FromName),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true,
        };
        message.To.Add(to);
        await client.SendMailAsync(message);
    }

    public async Task SendToSalesAsync(string subject, string htmlBody)
    {
        var to = string.IsNullOrWhiteSpace(_settings.SalesEmail) ? _settings.FromEmail : _settings.SalesEmail;
        await SendAsync(to, subject, htmlBody);
    }
}
