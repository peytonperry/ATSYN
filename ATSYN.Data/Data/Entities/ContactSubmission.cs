using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATSYN.Data.Data.Entities
{
    public class ContactSubmission
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }

        public bool IsRead { get; set; } = false;
        }

    public class ContactSubmissionDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public bool IsRead { get; set; }
    }

    public class CreateContactSubmissionDto
    {
        [MaxLength(100)]
        public string Name { get; init; } = string.Empty;

        [MaxLength(100)]
        public string Email { get; init; } = string.Empty;

        [MaxLength(200)]
        public string Subject { get; init; } = string.Empty;

        [MaxLength(250)]
        public string Message { get; init; } = string.Empty;
    }
}
