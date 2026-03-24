using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TextileOasis.Application.DTOs;
using TextileOasis.Application.Interfaces;

namespace TextileOasis.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _service;
    public OrdersController(IOrderService service) => _service = service;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto) => Ok(await _service.CreateAsync(GetUserId(), dto));

    [HttpGet("mine")]
    public async Task<IActionResult> GetMine() => Ok(await _service.GetMyOrdersAsync(GetUserId()));

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id) => (await _service.GetByIdAsync(id, GetUserId())) is { } x ? Ok(x) : NotFound();

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(claim)) throw new UnauthorizedAccessException("Token inválido.");
        return int.Parse(claim);
    }
}
