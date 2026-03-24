using Microsoft.AspNetCore.Mvc;
using TextileOasis.Application.DTOs;
using TextileOasis.Application.Interfaces;

namespace TextileOasis.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;
    public AuthController(IAuthService service) => _service = service;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try { return Ok(await _service.RegisterAsync(dto)); }
        catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _service.LoginAsync(dto);
        return result is null ? Unauthorized(new { message = "Credenciales inválidas." }) : Ok(result);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        try
        {
            var resetBaseUrl = $"{Request.Scheme}://{Request.Host}/reset-password";
            await _service.ForgotPasswordAsync(dto, resetBaseUrl);
            return Ok(new { message = "Si el correo existe, se enviaron instrucciones de recuperación." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        try
        {
            await _service.ResetPasswordAsync(dto);
            return Ok(new { message = "La contraseña fue actualizada correctamente." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("quote-request")]
    public async Task<IActionResult> QuoteRequest([FromBody] QuoteRequestDto dto)
    {
        try
        {
            await _service.SendQuoteRequestAsync(dto);
            return Ok(new { message = "Tu solicitud fue enviada correctamente. Nos comunicaremos contigo pronto." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
