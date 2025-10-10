using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ATSYN.Data.Data.Services
{
    public interface IEmailService
    {
        Task SendPurchaseReceipt(int orderId);
    }

    public class EmailService : IEmailService
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public EmailService(ApplicationDbContext context, HttpClient httpClient, IConfiguration config)
        {
            _context = context;
            _httpClient = httpClient;
            _config = config;
        }

        public async Task SendPurchaseReceipt(int orderId)
        {
            // Get order with related data
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                throw new Exception($"Order with ID {orderId} not found");
            }

            // Prepare email data
            var emailData = new
            {
                sender = _config["Email:SenderAddress"] ?? "orders@atsyn.com",
                to = new[] { order.CustomerEmail },
                subject = order.IsPickup
                   ? $"Order Ready for Pickup - {order.OrderNumber}"
                   : $"Order Confirmation - {order.OrderNumber}",
                template_id = "purchase_receipt",
                template_data = new
                {
                    customer_name = order.CustomerName,
                    order_number = order.OrderNumber,
                    order_date = order.OrderDate.ToString("MMMM dd, yyyy"),
                    is_pickup = order.IsPickup,
                    shipping_address = order.ShippingAddress,
                    billing_address = order.BillingAddress,
                    subtotal = order.SubTotal.ToString("C"),
                    tax_amount = order.TaxAmount.ToString("C"),
                    shipping_cost = order.ShippingCost.ToString("C"),
                    total_amount = order.TotalAmount.ToString("C"),
                    items = order.OrderItems.Select(item => new
                    {
                        product_name = item.Product.Title,
                        quantity = item.Quantity,
                        unit_price = item.UnitPrice.ToString("C"),
                        total_price = item.TotalPrice.ToString("C")
                    }).ToArray(),
                    notes = order.Notes ?? ""
                }
            };

            // Set API key header
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("X-Smtp2go-Api-Key", _config["Email:ApiKey"]);
            _httpClient.DefaultRequestHeaders.Add("accept", "application/json");

            // Send email
            var response = await _httpClient.PostAsJsonAsync(
                "https://api.smtp2go.com/v3/email/send",
                emailData
            );

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to send email: {errorContent}");
            }
        }
    }
}