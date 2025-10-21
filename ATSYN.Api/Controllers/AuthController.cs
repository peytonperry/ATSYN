using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ATSYN.Api.Controllers { 

[ApiController]
[Route("api/[controller]")]
    public class AuthController : ControllerBase {  
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;

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
                string roleAssign = register.Role ?? "Customer";

                if (await _roleManager.RoleExistsAsync(roleAssign))
                {
                    await _userManager.AddToRoleAsync(user, roleAssign);
                }
                else
                {
                    await _roleManager.CreateAsync(new IdentityRole(roleAssign));
                    await _userManager.AddToRoleAsync(user, roleAssign);
                }

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
                var user = await _userManager.FindByNameAsync(login.Email);
                var role = await _userManager.GetRolesAsync(user);
                return Ok(new
                {
                    Message = "Login successful",
                    UserId = user?.Id,
                    Email = user?.Email,
                    userRoles = role,
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
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }
            var role = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                role = role,
                EmailConfirmed = user.EmailConfirmed
            });
        }

        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfile)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            // Update username if changed
            if (!string.IsNullOrEmpty(updateProfile.UserName) && user.UserName != updateProfile.UserName)
            {
                user.UserName = updateProfile.UserName;
            }

            // Update email if changed
            if (!string.IsNullOrEmpty(updateProfile.Email) && user.Email != updateProfile.Email)
            {
                // Check if email is already taken
                var existingUser = await _userManager.FindByEmailAsync(updateProfile.Email);
                if (existingUser != null && existingUser.Id != user.Id)
                {
                    return BadRequest(new { Message = "Email is already taken" });
                }

                user.Email = updateProfile.Email;
                user.UserName = updateProfile.Email; // Since you use email as username
            }

            // Update phone number if provided
            if (!string.IsNullOrEmpty(updateProfile.Phone))
            {
                user.PhoneNumber = updateProfile.Phone;
            }

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { Message = "Profile updated successfully" });
            }

            return BadRequest(new { Message = "Failed to update profile", Errors = result.Errors });
        }


        public class RegisterDto
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string? Role { get; set; } = "Customer";
        }


        public class LoginDto
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public bool RememberMe { get; set; } = false;
        }

        public class UpdateProfileDto
        {
            public string? UserName { get; set; }
            public string? Email { get; set; }
            public string? Phone { get; set; }
        }
    }
}
