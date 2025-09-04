using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ATSYN.Data.Entities.Users;
//using ATSYN.Data.Entities;

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
        public async Task<ActionResult> Register([FromBody] UserDto dto)
        {
            var user = new User
            {
                Username = dto.Username,
                Password = dto.Password
            };

            var result = await userManager.CreateAsync(user, dto.Password);

            if (result.Succeeded)
            {
                return Ok("User created");
            }
            return BadRequest("Registration failed");
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await signInManager.PasswordSignInAsync(dto.Username, dto.Password, false, false);

            if (result.Succeeded)
            {
                return Ok("Login successful");
            }

            return BadRequest("Login failed");
        }

    }
}