using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ATSYN.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase 
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;

    public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto register)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = new IdentityUser
        {
            UserName = register.Email,
            Email = register.Email
        };

        var result = await _userManager.CreateAsync(user, register.Password);

        if (result.Succeeded)
        {
            return Ok(new { Message = "New user registered.", UserId = user.Id });
        }

        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(string.Empty, error.Description);
        }

        return BadRequest(ModelState);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto login)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _signInManager.PasswordSignInAsync(
            login.Email,
            login.Password,
            login.RememberMe,
            lockoutOnFailure: false);

        if (result.Succeeded)
        {
            var user = await  _userManager.FindByNameAsync(login.Email);
            return Ok(new
            {
                Message = "Login successful",
                UserId = user?.Id,
                Email = user?.Email
            });
        }

        if (result.IsLockedOut)
        {
            return BadRequest(new { Message = "User account locked out." });
        }
        
        return BadRequest(new { Message = "Invalid login attempt." });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var user = await  _userManager.GetUserAsync(User);
        if (user == null)
        {
            return NotFound(new { Message = "User not found" });
        }
        return Ok(new
        {
            Id = user.Id,
            Email = user.Email,
            UserName = user.UserName,
            EmailConfirmed = user.EmailConfirmed
        });
    }

    [HttpGet("test-auth")]
    [Authorize]
    public IActionResult TestAuth()
    {
        return Ok(new
        {
            Message = "You are authenticated!",
            UserId = User.FindFirst("sub")?.Value ?? User.FindFirst("id")?.Value,
            Email = User.FindFirst("email")?.Value
        });
    }
    
    public class RegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool RememberMe { get; set; } = false;
    }
}