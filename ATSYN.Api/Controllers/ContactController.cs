using ATSYN.Data.Data;
using ATSYN.Data.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ATSYN.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ContactController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllContactSubmissions()
        {
            var submissions = await _context.ContactSubmissions
                .Select(r => new ContactSubmissionDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Email = r.Email,
                    Subject = r.Subject,
                    Message = r.Message,
                    SubmittedAt = r.SubmittedAt,
                    IsRead = r.IsRead
                })
                .ToListAsync();
            return Ok(submissions);
        }


        [HttpPost("submit-contact")]
        public async Task<IActionResult> SubmitContactForm(CreateContactSubmissionDto dto)
        {
            var contactSubmission = new ContactSubmission
            {
                Name = dto.Name,
                Email = dto.Email,
                Subject = dto.Subject,
                Message = dto.Message,
                SubmittedAt = DateTime.UtcNow
            };
            _context.ContactSubmissions.Add(contactSubmission);
            await _context.SaveChangesAsync();
            return Ok(contactSubmission);
        }

        [HttpPut("toggle-read-unread/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var submission = await _context.ContactSubmissions.FindAsync(id);
            if (submission == null) 
                { 
                return NotFound(); 
            }
            if (submission.IsRead)
            {
                submission.IsRead = false;
                await _context.SaveChangesAsync();
                return Ok();
            }
            submission.IsRead = true;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("delete-contact/{id}")]
        public async Task<IActionResult> DeleteContactSubmission(int id)
        {
            var submission = await _context.ContactSubmissions.FindAsync(id);
            if (submission == null) 
                { 
                return NotFound(); 
            }

            _context.ContactSubmissions.Remove(submission);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    } 
}

    
