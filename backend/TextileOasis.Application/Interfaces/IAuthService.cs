using TextileOasis.Application.DTOs;

namespace TextileOasis.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    Task ForgotPasswordAsync(ForgotPasswordDto dto, string resetBaseUrl);
    Task ResetPasswordAsync(ResetPasswordDto dto);
    Task SendQuoteRequestAsync(QuoteRequestDto dto);
}
