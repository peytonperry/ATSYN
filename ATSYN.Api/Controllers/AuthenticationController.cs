using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ATSYN.Data.Entities.Users;

namespace ATSYN.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<User> signInManager;
        private readonly UserManager<User> userManager;

        public AuthController(SignInManager<User> signInManager, UserManager<User> userManager)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User
            {
                Username = dto.Username,
                Password = dto.Password
            };

            var result = await userManager.CreateAsync(user, dto.Password);

            if (result.Succeeded)
            {
                return Ok(new { message = "User created successfully" });
            }

            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { 
                message = "Registration failed", 
                errors = errors 
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await signInManager.PasswordSignInAsync(dto.Username, dto.Password, false, false);

            if (result.Succeeded)
            {
                return Ok(new { message = "Login successful" });
            }

            return BadRequest(new { message = "Invalid username or password" });
        }
    }
}