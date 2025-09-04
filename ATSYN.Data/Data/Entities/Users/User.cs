using Microsoft.AspNetCore.Identity;

namespace ATSYN.Data.Entities.Users
{
    public class User : IdentityUser
    {
        public string Username  { get; set; }
        public string Password { get; set; }
    }
    public class UserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}