using ATSYN.Data.Data;
using ATSYN.Data.Data.Entities.Reports;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace ATSYN.Api.Controllers
{

[ApiController]
[Route("api/[controller]")]
public class ReportController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public ReportController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;

        // Set Stripe API key
        var stripeSecretKey = _configuration["Stripe:SecretKey"];
        if (!string.IsNullOrEmpty(stripeSecretKey))
        {
            StripeConfiguration.ApiKey = stripeSecretKey;
        }
    }


    [HttpGet("financial")]
    public async Task<ActionResult<FinancialReportDto>> GetFinancialReport([FromQuery] int? year = null)
    {
        var selectedYear = year ?? DateTime.UtcNow.Year;
        var startDate = new DateTime(selectedYear, 1, 1);
        var endDate = new DateTime(selectedYear, 12, 31, 23, 59, 59);
        var currentMonth = DateTime.UtcNow.Month;
        var currentYear = DateTime.UtcNow.Year;

        var orders = await _context.Orders
            .Where(o => o.OrderDate >= startDate &&
                       o.OrderDate <= endDate &&
                       o.Status == OrderStatus.Delivered) 
            .Select(o => new { o.TotalAmount, o.OrderDate, o.OrderNumber })
            .ToListAsync();

        var currentMonthRevenue = selectedYear == currentYear
            ? orders.Where(o => o.OrderDate.Month == currentMonth).Sum(o => o.TotalAmount)
            : 0;

        var yearToDateRevenue = orders.Sum(o => o.TotalAmount);

        var monthlyRevenue = orders
            .GroupBy(o => o.OrderDate.Month)
            .Select(g => new MonthlyRevenueDto
            {
                Month = new DateTime(selectedYear, g.Key, 1).ToString("MMMM"),
                Revenue = g.Sum(o => o.TotalAmount),
                Transactions = g.Count()
            })
            .OrderBy(m => DateTime.ParseExact(m.Month, "MMMM", null).Month)
            .ToList();

        decimal stripeFees = 0;
        decimal stripeRevenue = 0;
        int stripeTransactionCount = 0;

        try
        {
            var paymentIntentService = new PaymentIntentService();
            var options = new PaymentIntentListOptions
            {
                Limit = 100
            };

            var paymentIntents = new List<PaymentIntent>();
            var stripeList = await paymentIntentService.ListAsync(options);
            paymentIntents.AddRange(stripeList.Data);

            while (stripeList.HasMore)
            {
                options.StartingAfter = stripeList.Data.Last().Id;
                stripeList = await paymentIntentService.ListAsync(options);
                paymentIntents.AddRange(stripeList.Data);
            }

            var succeededPayments = paymentIntents
                .Where(pi => pi.Status == "succeeded" &&
                            pi.Created >= startDate &&
                            pi.Created <= endDate)
                .ToList();

            stripeRevenue = succeededPayments.Sum(pi => pi.Amount) / 100m;
            stripeTransactionCount = succeededPayments.Count;


            foreach (var payment in succeededPayments)
            {
                stripeFees += (payment.Amount / 100m * 0.029m) + 0.30m;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching Stripe data: {ex.Message}");
        }

        return Ok(new FinancialReportDto
        {
            CurrentMonth = currentMonthRevenue,
            YearToDate = yearToDateRevenue,
            NetRevenue = yearToDateRevenue - stripeFees,
            TotalFees = stripeFees,
            TransactionCount = orders.Count,
            MonthlyRevenue = monthlyRevenue,
            StripeRevenue = stripeRevenue,
            StripeTransactionCount = stripeTransactionCount
        });
    }


    [HttpGet("orders")]
    public async Task<ActionResult<OrderReportDto>> GetOrderReport([FromQuery] int? year = null)
    {
        var selectedYear = year ?? DateTime.UtcNow.Year;
        var startDate = new DateTime(selectedYear, 1, 1);
        var endDate = new DateTime(selectedYear, 12, 31, 23, 59, 59);
        var currentMonth = DateTime.UtcNow.Month;
        var currentYear = DateTime.UtcNow.Year;

        var orders = await _context.Orders
            .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
            .Select(o => new {
                o.Id,
                o.OrderDate,
                o.Status,
                o.TotalAmount,
                o.OrderNumber
            })
            .ToListAsync();

        var currentMonthOrders = selectedYear == currentYear
            ? orders.Count(o => o.OrderDate.Month == currentMonth)
            : 0;

        var yearToDateOrders = orders.Count;

        var ordersByStatus = orders
            .GroupBy(o => o.Status)
            .ToDictionary(g => g.Key, g => g.Count());

        var monthlyOrders = orders
            .GroupBy(o => o.OrderDate.Month)
            .Select(g => new MonthlyOrderDto
            {
                Month = new DateTime(selectedYear, g.Key, 1).ToString("MMMM"),
                Orders = g.Count(),
                DeliveredOrders = g.Count(o => o.Status == OrderStatus.Delivered),
                AverageOrderValue = g.Average(o => o.TotalAmount),
                TotalRevenue = g.Where(o => o.Status == OrderStatus.Delivered).Sum(o => o.TotalAmount)
            })
            .OrderBy(m => DateTime.ParseExact(m.Month, "MMMM", null).Month)
            .ToList();

        int stripeVerifiedPayments = 0;
        try
        {
            var paymentIntentService = new PaymentIntentService();
            var options = new PaymentIntentListOptions
            {
                Limit = 100
            };

            var paymentIntents = await paymentIntentService.ListAsync(options);

            stripeVerifiedPayments = paymentIntents.Data
                .Count(pi => pi.Status == "succeeded" &&
                            pi.Created >= startDate &&
                            pi.Created <= endDate);

            while (paymentIntents.HasMore)
            {
                options.StartingAfter = paymentIntents.Data.Last().Id;
                paymentIntents = await paymentIntentService.ListAsync(options);
                stripeVerifiedPayments += paymentIntents.Data
                    .Count(pi => pi.Status == "succeeded" &&
                                pi.Created >= startDate &&
                                pi.Created <= endDate);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching Stripe payment data: {ex.Message}");
        }

        return Ok(new OrderReportDto
        {
            CurrentMonth = currentMonthOrders,
            YearToDate = yearToDateOrders,
            StripeVerifiedPayments = stripeVerifiedPayments,
            PendingOrders = ordersByStatus.GetValueOrDefault(OrderStatus.Pending, 0),
            ProcessingOrders = ordersByStatus.GetValueOrDefault(OrderStatus.Processing, 0),
            DeliveredOrders = ordersByStatus.GetValueOrDefault(OrderStatus.Delivered, 0),
            CancelledOrders = ordersByStatus.GetValueOrDefault(OrderStatus.Cancelled, 0),
            MonthlyOrders = monthlyOrders
        });
    }


    [HttpGet("dashboard-summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetDashboardSummary()
    {
        var currentYear = DateTime.UtcNow.Year;
        var currentMonth = DateTime.UtcNow.Month;
        var startOfYear = new DateTime(currentYear, 1, 1);
        var startOfMonth = new DateTime(currentYear, currentMonth, 1);

        var yearOrders = await _context.Orders
            .Where(o => o.OrderDate >= startOfYear)
            .ToListAsync();

        var monthOrders = yearOrders.Where(o => o.OrderDate >= startOfMonth).ToList();

        var summary = new DashboardSummaryDto
        {
            MonthRevenue = monthOrders.Where(o => o.Status == OrderStatus.Delivered).Sum(o => o.TotalAmount),
            MonthOrders = monthOrders.Count,
            MonthPendingOrders = monthOrders.Count(o => o.Status == OrderStatus.Pending),

            YearRevenue = yearOrders.Where(o => o.Status == OrderStatus.Delivered).Sum(o => o.TotalAmount),
            YearOrders = yearOrders.Count,
            YearPendingOrders = yearOrders.Count(o => o.Status == OrderStatus.Pending),

            AverageOrderValue = yearOrders.Any() ? yearOrders.Average(o => o.TotalAmount) : 0,

            TotalPending = yearOrders.Count(o => o.Status == OrderStatus.Pending),
            TotalConfirmed = yearOrders.Count(o => o.Status == OrderStatus.Confirmed),
            TotalProcessing = yearOrders.Count(o => o.Status == OrderStatus.Processing),
            TotalShipped = yearOrders.Count(o => o.Status == OrderStatus.Shipped),
            TotalDelivered = yearOrders.Count(o => o.Status == OrderStatus.Delivered),
            TotalCancelled = yearOrders.Count(o => o.Status == OrderStatus.Cancelled),
            TotalRefunded = yearOrders.Count(o => o.Status == OrderStatus.Refunded),
            TotalReturned = yearOrders.Count(o => o.Status == OrderStatus.Returned),
        };

        return Ok(summary);
    }



}
}

