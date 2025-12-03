using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
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

    public class ReportDto
    {
        public int Id { get; set; }
        public string ReportType { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? ReportData { get; set; }
        public string GeneratedBy { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
        public ReportStatus Status { get; set; }
        public string? Notes { get; set; }
    }

    public class FinancialReportDto
    {
        public decimal CurrentMonth { get; set;  }
        public decimal YearToDate { get; set; }
        public decimal NetRevenue { get; set; }
        public decimal TotalFees { get; set; }
        public int TransactionCount { get; set; }
        public List<MonthlyRevenueDto> MonthlyRevenue { get; set; } = new();

        public decimal StripeRevenue { get; set; }

        public int StripeTransactionCount { get; set; }

    }

    public class MonthlyRevenueDto
    {
        [Required]
        public string Month { get; set; } = string.Empty;

        public decimal Revenue { get; set; }
        public int Transactions { get; set; }

    }

    public class OrderReportDto
    {
        public int CurrentMonth { get; set; }
        public int YearToDate { get; set; }
        public int StripeVerifiedPayments { get; set; }
        public int PendingOrders { get; set; }
        public int ConfirmedOrders { get; set; }   
        public int ProcessingOrders { get; set; } 
        public int ShippedOrders { get; set; }
        public int DeliveredOrders { get; set; }
        public int CancelledOrders { get; set; }
        public int ReturnedOrders { get; set; }
        public int RefundedOrders { get; set; } 

        public List<MonthlyOrderDto> MonthlyOrders { get; set; } = new();

    }

    public class MonthlyOrderDto
    {
        [Required]
        public string Month { get; set; } = string.Empty;
        public int Orders { get; set; }
        public int DeliveredOrders { get; set; }
        public decimal AverageOrderValue { get; set; }
        public decimal TotalRevenue { get; set; }


    }


    public class DashboardSummaryDto
    {
        public decimal MonthRevenue { get; set; }
        public int MonthOrders { get; set; }
        public int MonthPendingOrders { get; set; }
        public int MonthConfirmedOrders { get; set; }
        public int MonthProccessedOrders { get; set; }
        public int MonthShippedOrders { get; set; }
        public int MonthDeliveredOrders { get; set; }
        public int MonthCancelledOrders { get; set; }
        public int MonthReturnedOrders { get; set; }
        public int MonthRefundedOrders { get; set; }

        public decimal YearRevenue { get; set; }
        public int YearOrders { get; set; }
        public decimal AverageOrderValue { get; set; }

        public int YearPendingOrders { get; set; }

        public int TotalPending { get; set; }
        public int TotalConfirmed { get; set; }
        public int TotalProcessing { get; set; }
        public int TotalShipped { get; set; }
        public int TotalDelivered { get; set; }
        public int TotalCancelled { get; set; }
        public int TotalReturned { get; set; }
        public int TotalRefunded { get; set; }

    }

    public class ReportDateRangeDto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int? Year { get; set; }
    }

    public class StripeTransactionReportDto
    {
        public string PaymentIntentId { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public decimal Fees { get; set; }

        public decimal NetAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        
        public string? OrderNumber { get; set; }
    }


    public class ReportConfiguration : IEntityTypeConfiguration<Report>
    {
        public void Configure(EntityTypeBuilder<Report> builder)
        {
            builder.HasKey(r => r.Id);

            builder.Property(r => r.ReportType)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(r => r.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(r => r.Description)
                .HasMaxLength(1000);

            builder.Property(r => r.StartDate)
                .IsRequired();

            builder.Property(r => r.EndDate)
                .IsRequired();

            builder.Property(r => r.ReportData)
                .HasColumnType("nvarchar(max)"); 

            builder.Property(r => r.GeneratedBy)
                .HasMaxLength(100);

            builder.Property(r => r.GeneratedAt)
                .IsRequired();

            builder.Property(r => r.Status)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(r => r.Notes)
                .HasMaxLength(500);

            builder.HasIndex(r => r.ReportType);
            builder.HasIndex(r => r.GeneratedAt);
            builder.HasIndex(r => r.Status);
            builder.HasIndex(r => new { r.StartDate, r.EndDate });

            builder.ToTable("Reports");
        }

    }
}
