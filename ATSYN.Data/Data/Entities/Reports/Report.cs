using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATSYN.Data.Data.Entities.Reports
{
    public class Report
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string ReportType { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string? ReportData { get; set; }

        [MaxLength(100)]
        public string GeneratedBy { get; set; } = string.Empty;

        public DateTime GeneratedAt { get; set;  } = DateTime.UtcNow;

        public ReportStatus Status { get; set; } = ReportStatus.Generated;

        [MaxLength(500)]
        public string? Notes { get; set; }
    }

    public enum ReportStatus
    {
        Generated = 1,
        Archived = 2,
        Deleted = 3
    }

    
}
