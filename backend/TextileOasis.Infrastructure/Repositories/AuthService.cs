using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using TextileOasis.Application.DTOs;
using TextileOasis.Application.Interfaces;
using TextileOasis.Domain.Entities;
using TextileOasis.Infrastructure.Persistence;
using TextileOasis.Infrastructure.Security;

namespace TextileOasis.Infrastructure.Repositories;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly JwtTokenGenerator _tokenGenerator;
    private readonly EmailSender _emailSender;
    public AuthService(AppDbContext context, JwtTokenGenerator tokenGenerator, EmailSender emailSender)
    {
        _context = context;
        _tokenGenerator = tokenGenerator;
        _emailSender = emailSender;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var email = dto.Email.Trim().ToLower();
        if (await _context.Users.AnyAsync(u => u.Email == email)) throw new Exception("El correo ya está registrado.");
        var user = new User { FullName = dto.FullName.Trim(), Email = email, PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password), PhoneNumber = dto.PhoneNumber.Trim(), Role = "Client", IsActive = true };
        _context.Users.Add(user); await _context.SaveChangesAsync();
        return new AuthResponseDto { Token = _tokenGenerator.GenerateToken(user), FullName = user.FullName, Email = user.Email, Role = user.Role };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var email = dto.Email.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
        if (user is null) return null;
        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) return null;
        return new AuthResponseDto { Token = _tokenGenerator.GenerateToken(user), FullName = user.FullName, Email = user.Email, Role = user.Role };
    }

    public async Task ForgotPasswordAsync(ForgotPasswordDto dto, string resetBaseUrl)
    {
        var email = dto.Email.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
        if (user is null) return;

        user.ResetPasswordToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        user.ResetPasswordTokenExpiresAt = DateTime.UtcNow.AddHours(1);
        await _context.SaveChangesAsync();

        var resetUrl = $"{resetBaseUrl}?token={Uri.EscapeDataString(user.ResetPasswordToken)}";
       var body = $"<p>Hola {user.FullName},</p><p>Recibimos una solicitud para restablecer tu contraseña.</p><p><a href='{resetUrl}'>Haz clic aquí para restablecer tu contraseña</a></p><p>Si no solicitaste este cambio, ignora este mensaje.</p>";
        await _emailSender.SendAsync(user.Email, "Recuperación de contraseña - Textil Salas", body);
    }

    public async Task ResetPasswordAsync(ResetPasswordDto dto)
    {
        var token = dto.Token.Trim();
        if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(dto.NewPassword))
            throw new Exception("Token o nueva contraseña inválidos.");

        var user = await _context.Users.FirstOrDefaultAsync(u => u.ResetPasswordToken == token && u.ResetPasswordTokenExpiresAt > DateTime.UtcNow && u.IsActive);
        if (user is null)
            throw new Exception("El enlace de recuperación es inválido o ha expirado.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.ResetPasswordToken = null;
        user.ResetPasswordTokenExpiresAt = null;
        await _context.SaveChangesAsync();
    }

    public async Task SendQuoteRequestAsync(QuoteRequestDto dto)
    {
        var subject = $"Nueva solicitud B2B - {dto.CompanyName}";
        var body = $@"
            <h2>Nueva solicitud de cotización empresarial</h2>
            <p><strong>Empresa:</strong> {dto.CompanyName}</p>
            <p><strong>Contacto:</strong> {dto.ContactName}</p>
            <p><strong>Teléfono:</strong> {dto.PhoneNumber}</p>
            <p><strong>Correo:</strong> {dto.Email}</p>
            <p><strong>Producto requerido:</strong> {dto.ProductRequired}</p>
            <p><strong>Cantidad estimada:</strong> {dto.EstimatedQuantity}</p>
            <p><strong>Mensaje:</strong><br/>{dto.Message}</p>";
        await _emailSender.SendToSalesAsync(subject, body);
    }
}
