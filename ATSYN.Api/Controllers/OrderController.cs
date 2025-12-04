using ATSYN.Api.Features;
using ATSYN.Data.Data;
using ATSYN.Data.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ATSYN.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public OrdersController(ApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    #region Order CRUD Operations

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders([FromQuery] OrderStatus? status = null)
    {
        var query = _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Category)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(o => o.Status == status.Value);
        }

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                OrderDate = o.OrderDate,
                CustomerName = o.CustomerName,
                CustomerEmail = o.CustomerEmail,
                ShippingAddress = o.ShippingAddress,
                IsPickup = o.IsPickup,
                BillingAddress = o.BillingAddress,
                SubTotal = o.SubTotal,
                TaxAmount = o.TaxAmount,
                ShippingCost = o.ShippingCost,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                StatusName = o.Status.GetDisplayName(),
                Notes = o.Notes,
                CreatedAt = o.CreatedAt,
                UpdatedAt = o.UpdatedAt,
                OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    UnitPrice = oi.UnitPrice,
                    Quantity = oi.Quantity,
                    TotalPrice = oi.TotalPrice,
                    Product = new ProductDto
                    {
                        Id = oi.Product.Id,
                        Title = oi.Product.Title,
                        Description = oi.Product.Description,
                        Price = oi.Product.Price,
                        CategoryId = oi.Product.CategoryId,
                        StockAmount = oi.Product.StockAmount,
                        IsVisible = oi.Product.IsVisible,
                        ShippingTypeId = oi.Product.ShippingTypeId,
                        InStock = oi.Product.InStock,
                        Category = new CategoryDto
                        {
                            Id = oi.Product.Category.Id,
                            Name = oi.Product.Category.Name
                        }
                    }
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

        var order = await _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Category)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound($"Order with ID {id} not found.");
        }

        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && order.CustomerEmail != userEmail)
        {
            return Forbid();
        }

        var orderDto = new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            OrderDate = order.OrderDate,
            CustomerName = order.CustomerName,
            CustomerEmail = order.CustomerEmail,
            ShippingAddress = order.ShippingAddress,
            BillingAddress = order.BillingAddress,
            SubTotal = order.SubTotal,
            TaxAmount = order.TaxAmount,
            ShippingCost = order.ShippingCost,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            StatusName = order.Status.GetDisplayName(),
            Notes = order.Notes,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            OrderItems = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                UnitPrice = oi.UnitPrice,
                Quantity = oi.Quantity,
                TotalPrice = oi.TotalPrice,
                Product = new ProductDto
                {
                    Id = oi.Product.Id,
                    Title = oi.Product.Title,
                    Description = oi.Product.Description,
                    Price = oi.Product.Price,
                    CategoryId = oi.Product.CategoryId,
                    StockAmount = oi.Product.StockAmount,
                    IsVisible = oi.Product.IsVisible,
                    ShippingTypeId = oi.Product.ShippingTypeId,
                    InStock = oi.Product.InStock,
                    Category = new CategoryDto
                    {
                        Id = oi.Product.Category.Id,
                        Name = oi.Product.Category.Name
                    }
                }
            }).ToList()
        };

        return Ok(orderDto);
    }

    [HttpGet("number/{orderNumber}")]
    public async Task<ActionResult<OrderDto>> GetOrderByNumber(string orderNumber)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Category)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

        if (order == null)
        {
            return NotFound($"Order with number {orderNumber} not found.");
        }

        var orderDto = MapToOrderDto(order);
        return Ok(orderDto);
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto createOrderDto)
    {
        Console.WriteLine($"=== CREATE ORDER DEBUG START ===");
        Console.WriteLine($"Customer: {createOrderDto.CustomerName} ({createOrderDto.CustomerEmail})");
        Console.WriteLine($"Shipping: {createOrderDto.ShippingAddress}");
        Console.WriteLine($"Billing: {createOrderDto.BillingAddress}");
        Console.WriteLine($"IsPickup: {createOrderDto.IsPickup}");
        Console.WriteLine($"ShippingCost: {createOrderDto.ShippingCost}");
        Console.WriteLine($"Received order items count: {createOrderDto.OrderItems?.Count ?? 0}");
        
        if (createOrderDto.OrderItems == null || !createOrderDto.OrderItems.Any())
        {
            Console.WriteLine($"ERROR: No order items provided");
            return BadRequest("No order items provided");
        }

        foreach (var item in createOrderDto.OrderItems)
        {
            Console.WriteLine($"  Order Item: ProductId={item.ProductId}, Name={item.ProductName}, Price={item.UnitPrice}, Qty={item.Quantity}, AttrValueId={item.SelectedAttributeValueId}");
        }
        
        var productIds = createOrderDto.OrderItems.Select(oi => oi.ProductId).Distinct().ToList();
        Console.WriteLine($"Product IDs requested: [{string.Join(", ", productIds)}]");
        
        var products = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.AttributeValues)
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync();
        
        Console.WriteLine($"Products found in database: {products.Count}");
        foreach (var p in products)
        {
            Console.WriteLine($"  Found Product: Id={p.Id}, Title={p.Title}, Price={p.Price}, Stock={p.StockAmount}, InStock={p.InStock}");
        }

        if (products.Count != productIds.Count)
        {
            var missingIds = productIds.Except(products.Select(p => p.Id));
            Console.WriteLine($"ERROR: Missing product IDs: [{string.Join(", ", missingIds)}]");
            return BadRequest($"Products not found: {string.Join(", ", missingIds)}");
        }

        Console.WriteLine($"All products found, checking stock...");

        var stockIssues = new List<string>();
        foreach (var orderItem in createOrderDto.OrderItems)
        {
            var product = products.First(p => p.Id == orderItem.ProductId);
            
            if (orderItem.SelectedAttributeValueId.HasValue)
            {
                Console.WriteLine($"Checking variant stock for Product {product.Id}, AttributeValueId {orderItem.SelectedAttributeValueId}");
                var attributeValue = product.AttributeValues
                    .FirstOrDefault(av => av.Id == orderItem.SelectedAttributeValueId.Value);
                
                if (attributeValue != null)
                {
                    Console.WriteLine($"  Found attribute value: Id={attributeValue.Id}, Value={attributeValue.Value}, Stock={attributeValue.StockAmount}");
                }
                else
                {
                    Console.WriteLine($"  Attribute value NOT FOUND");
                }
                
                if (attributeValue != null && attributeValue.StockAmount.HasValue)
                {
                    if (attributeValue.StockAmount < orderItem.Quantity)
                    {
                        stockIssues.Add($"Product '{product.Title}' variant has insufficient stock. Available: {attributeValue.StockAmount}, Requested: {orderItem.Quantity}");
                    }
                }
                else if (!product.InStock)
                {
                    stockIssues.Add($"Product '{product.Title}' is out of stock");
                }
                else if (product.StockAmount < orderItem.Quantity)
                {
                    stockIssues.Add($"Product '{product.Title}' has insufficient stock. Available: {product.StockAmount}, Requested: {orderItem.Quantity}");
                }
            }
            else
            {
                Console.WriteLine($"Checking product stock for Product {product.Id} (no variant)");
                if (!product.InStock)
                {
                    stockIssues.Add($"Product '{product.Title}' is out of stock");
                }
                else if (product.StockAmount < orderItem.Quantity)
                {
                    stockIssues.Add($"Product '{product.Title}' has insufficient stock. Available: {product.StockAmount}, Requested: {orderItem.Quantity}");
                }
            }
        }

        if (stockIssues.Any())
        {
            Console.WriteLine($"ERROR: Stock issues found: {string.Join("; ", stockIssues)}");
            return BadRequest($"Stock issues: {string.Join("; ", stockIssues)}");
        }

        Console.WriteLine($"Stock validation passed, generating order number...");
        var orderNumber = await GenerateOrderNumber();
        Console.WriteLine($"Order number generated: {orderNumber}");

        decimal subTotal = 0;
        var orderItems = new List<OrderItem>();

        foreach (var orderItemDto in createOrderDto.OrderItems)
        {
            var product = products.First(p => p.Id == orderItemDto.ProductId);
            
            var unitPrice = orderItemDto.UnitPrice;
            var productName = orderItemDto.ProductName;
            
            var itemTotal = unitPrice * orderItemDto.Quantity;
            subTotal += itemTotal;

            Console.WriteLine($"Creating order item: {productName} @ ${unitPrice} x {orderItemDto.Quantity} = ${itemTotal}");

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = productName,
                UnitPrice = unitPrice,
                Quantity = orderItemDto.Quantity,
                TotalPrice = itemTotal
            });
        }

        var taxAmount = subTotal * 0.085m;
        var totalAmount = subTotal + taxAmount + createOrderDto.ShippingCost;

        Console.WriteLine($"Order totals: SubTotal=${subTotal}, Tax=${taxAmount}, Shipping=${createOrderDto.ShippingCost}, Total=${totalAmount}");

        var order = new Order
        {
            OrderNumber = orderNumber,
            OrderDate = DateTime.UtcNow,
            CustomerName = createOrderDto.CustomerName,
            CustomerEmail = createOrderDto.CustomerEmail,
            ShippingAddress = createOrderDto.ShippingAddress,
            BillingAddress = createOrderDto.BillingAddress,
            IsPickup = createOrderDto.IsPickup,
            SubTotal = subTotal,
            TaxAmount = taxAmount,
            ShippingCost = createOrderDto.IsPickup ? 0 : createOrderDto.ShippingCost,
            TotalAmount = totalAmount,
            Status = OrderStatus.Pending,
            Notes = createOrderDto.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            OrderItems = orderItems
        };

        Console.WriteLine($"Adding order to database...");
        _context.Orders.Add(order);

        Console.WriteLine($"Updating stock...");
        foreach (var orderItemDto in createOrderDto.OrderItems)
        {
            var product = products.First(p => p.Id == orderItemDto.ProductId);
            
            if (orderItemDto.SelectedAttributeValueId.HasValue)
            {
                var attributeValue = product.AttributeValues
                    .FirstOrDefault(av => av.Id == orderItemDto.SelectedAttributeValueId.Value);
                
                if (attributeValue != null && attributeValue.StockAmount.HasValue)
                {
                    var oldStock = attributeValue.StockAmount;
                    attributeValue.StockAmount -= orderItemDto.Quantity;
                    if (attributeValue.StockAmount <= 0)
                    {
                        attributeValue.StockAmount = 0;
                    }
                    Console.WriteLine($"  Updated variant stock: Product {product.Id}, Attr {attributeValue.Id}: {oldStock} -> {attributeValue.StockAmount}");
                }
            }
            
            var oldProductStock = product.StockAmount;
            product.StockAmount -= orderItemDto.Quantity;
            if (product.StockAmount <= 0)
            {
                product.InStock = false;
            }
            Console.WriteLine($"  Updated product stock: Product {product.Id}: {oldProductStock} -> {product.StockAmount}, InStock={product.InStock}");
        }

        Console.WriteLine($"Saving changes to database...");
        await _context.SaveChangesAsync();
        Console.WriteLine($"Order saved successfully with ID: {order.Id}");

        try
        {
            Console.WriteLine($"Sending receipt email...");
            await _emailService.SendPurchaseReceipt(order.Id);
            Console.WriteLine($"Receipt email sent successfully");
        }catch (Exception ex)
        {
            Console.WriteLine($"Failed to send receipt email: {ex.Message}");
        }

        Console.WriteLine($"Adding status history...");
        await AddStatusHistory(order.Id, OrderStatus.Pending, OrderStatus.Pending, "Order created", "System");
        await _context.SaveChangesAsync();

        Console.WriteLine($"Loading created order for response...");
        var createdOrder = await _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Category)
            .FirstAsync(o => o.Id == order.Id);

        var responseDto = MapToOrderDto(createdOrder);
        Console.WriteLine($"=== CREATE ORDER DEBUG END - SUCCESS ===");
        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, responseDto);
    }

    #endregion

    #region Order Status Management

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, UpdateOrderStatusDto updateStatusDto)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound($"Order with ID {id} not found.");
        }

        var oldStatus = order.Status;
        
        if (!IsValidStatusTransition(oldStatus, updateStatusDto.Status))
        {
            return BadRequest($"Invalid status transition from {oldStatus.GetDisplayName()} to {updateStatusDto.Status.GetDisplayName()}");
        }

        order.Status = updateStatusDto.Status;
        order.UpdatedAt = DateTime.UtcNow;

        await AddStatusHistory(id, oldStatus, updateStatusDto.Status, updateStatusDto.Notes, updateStatusDto.ChangedBy ?? "System");

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("{id}/status-history")]
    public async Task<ActionResult<IEnumerable<OrderStatusHistoryDto>>> GetOrderStatusHistory(int id)
    {
        var orderExists = await _context.Orders.AnyAsync(o => o.Id == id);
        if (!orderExists)
        {
            return NotFound($"Order with ID {id} not found.");
        }

        var statusHistory = await _context.OrderStatusHistory
            .Where(osh => osh.OrderId == id)
            .OrderByDescending(osh => osh.ChangedAt)
            .Select(osh => new OrderStatusHistoryDto
            {
                Id = osh.Id,
                FromStatus = osh.FromStatus,
                FromStatusName = osh.FromStatus.GetDisplayName(),
                ToStatus = osh.ToStatus,
                ToStatusName = osh.ToStatus.GetDisplayName(),
                ChangedAt = osh.ChangedAt,
                Notes = osh.Notes,
                ChangedBy = osh.ChangedBy
            })
            .ToListAsync();

        return Ok(statusHistory);
    }

    #endregion

    #region Customer Orders

    [HttpGet("customer/{customerEmail}")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetCustomerOrders(string customerEmail)
    {
        var projection = MapToOrderDtoExpression();
        var orders = await _context.Orders
    .Include(o => o.OrderItems)
        .ThenInclude(oi => oi.Product)
            .ThenInclude(p => p.Category)
    .Where(o => o.CustomerEmail == customerEmail)
    .OrderByDescending(o => o.CreatedAt)
    .Select(projection)
    .ToListAsync();

        return Ok(orders);
    }

    #endregion

    #region Order Statistics

    [HttpGet("statistics")]
    public async Task<ActionResult<OrderStatisticsDto>> GetOrderStatistics([FromQuery] DateTime? from = null, [FromQuery] DateTime? to = null)
    {
        var query = _context.Orders.AsQueryable();

        if (from.HasValue)
            query = query.Where(o => o.OrderDate >= from.Value);

        if (to.HasValue)
            query = query.Where(o => o.OrderDate <= to.Value);

        var statistics = new OrderStatisticsDto
        {
            TotalOrders = await query.CountAsync(),
            PendingOrders = await query.CountAsync(o => o.Status == OrderStatus.Pending),
            ConfirmedOrders = await query.CountAsync(o => o.Status == OrderStatus.Confirmed),
            ProcessingOrders = await query.CountAsync(o => o.Status == OrderStatus.Processing),
            ShippedOrders = await query.CountAsync(o => o.Status == OrderStatus.Shipped),
            DeliveredOrders = await query.CountAsync(o => o.Status == OrderStatus.Delivered),
            CancelledOrders = await query.CountAsync(o => o.Status == OrderStatus.Cancelled),
            RefundedOrders = await query.CountAsync(o => o.Status == OrderStatus.Refunded),
            TotalRevenue = await query.SumAsync(o => o.TotalAmount),
            AverageOrderValue = await query.AverageAsync(o => o.TotalAmount),
            FromDate = from,
            ToDate = to
        };

        return Ok(statistics);
    }

    [HttpGet("status-summary")]
    public async Task<ActionResult<IEnumerable<OrderStatusSummaryDto>>> GetOrderStatusSummary()
    {
        var statusSummary = await _context.Orders
            .GroupBy(o => o.Status)
            .Select(g => new OrderStatusSummaryDto
            {
                Status = g.Key,
                StatusName = g.Key.GetDisplayName(),
                Count = g.Count(),
                TotalValue = g.Sum(o => o.TotalAmount)
            })
            .OrderBy(s => s.Status)
            .ToListAsync();

        return Ok(statusSummary);
    }

    #endregion

    #region Helper Methods

    private async Task<string> GenerateOrderNumber()
    {
        var today = DateTime.UtcNow.ToString("yyyyMMdd");
        var lastOrder = await _context.Orders
            .Where(o => o.OrderNumber.StartsWith($"ORD-{today}"))
            .OrderByDescending(o => o.OrderNumber)
            .FirstOrDefaultAsync();

        int nextSequence = 1;
        if (lastOrder != null)
        {
            var lastSequence = lastOrder.OrderNumber.Split('-').LastOrDefault();
            if (int.TryParse(lastSequence, out int sequence))
            {
                nextSequence = sequence + 1;
            }
        }

        return $"ORD-{today}-{nextSequence:D4}";
    }

    private bool IsValidStatusTransition(OrderStatus from, OrderStatus to)
    {
        return from switch
        {
            OrderStatus.Pending => to is OrderStatus.Confirmed or OrderStatus.Cancelled,
            OrderStatus.Confirmed => to is OrderStatus.Processing or OrderStatus.Cancelled,
            OrderStatus.Processing => to is OrderStatus.Shipped or OrderStatus.Cancelled,
            OrderStatus.Shipped => to is OrderStatus.Delivered or OrderStatus.Returned,
            OrderStatus.Delivered => to is OrderStatus.Returned,
            OrderStatus.Returned => to is OrderStatus.Refunded,
            OrderStatus.Cancelled => to is OrderStatus.Refunded,
            OrderStatus.Refunded => false,
            _ => false
        };
    }

    private async Task AddStatusHistory(int orderId, OrderStatus fromStatus, OrderStatus toStatus, string? notes, string? changedBy)
    {
        var statusHistory = new OrderStatusHistory
        {
            OrderId = orderId,
            FromStatus = fromStatus,
            ToStatus = toStatus,
            ChangedAt = DateTime.UtcNow,
            Notes = notes,
            ChangedBy = changedBy
        };

        _context.OrderStatusHistory.Add(statusHistory);
    }

    private OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            OrderDate = order.OrderDate,
            CustomerName = order.CustomerName,
            CustomerEmail = order.CustomerEmail,
            ShippingAddress = order.ShippingAddress,
            BillingAddress = order.BillingAddress,
            SubTotal = order.SubTotal,
            TaxAmount = order.TaxAmount,
            ShippingCost = order.ShippingCost,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            StatusName = order.Status.GetDisplayName(),
            Notes = order.Notes,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            OrderItems = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                UnitPrice = oi.UnitPrice,
                Quantity = oi.Quantity,
                TotalPrice = oi.TotalPrice,
                Product = oi.Product != null ? new ProductDto
                {
                    Id = oi.Product.Id,
                    Title = oi.Product.Title,
                    Description = oi.Product.Description,
                    Price = oi.Product.Price,
                    CategoryId = oi.Product.CategoryId,
                    StockAmount = oi.Product.StockAmount,
                    IsVisible = oi.Product.IsVisible,
                    ShippingTypeId = oi.Product.ShippingTypeId,
                    InStock = oi.Product.InStock,
                    Category = oi.Product.Category != null ? new CategoryDto
                    {
                        Id = oi.Product.Category.Id,
                        Name = oi.Product.Category.Name
                    } : null
                } : null
            }).ToList()
        };
    }

    private System.Linq.Expressions.Expression<System.Func<Order, OrderDto>> MapToOrderDtoExpression()
    {
        return o => new OrderDto
        {
            Id = o.Id,
            OrderNumber = o.OrderNumber,
            OrderDate = o.OrderDate,
            CustomerName = o.CustomerName,
            CustomerEmail = o.CustomerEmail,
            ShippingAddress = o.ShippingAddress,
            BillingAddress = o.BillingAddress,
            SubTotal = o.SubTotal,
            TaxAmount = o.TaxAmount,
            ShippingCost = o.ShippingCost,
            TotalAmount = o.TotalAmount,
            Status = o.Status,
            StatusName = o.Status.GetDisplayName(),
            Notes = o.Notes,
            CreatedAt = o.CreatedAt,
            UpdatedAt = o.UpdatedAt,
            OrderItems = o.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                UnitPrice = oi.UnitPrice,
                Quantity = oi.Quantity,
                TotalPrice = oi.TotalPrice,
                Product = new ProductDto
                {
                    Id = oi.Product.Id,
                    Title = oi.Product.Title,
                    Description = oi.Product.Description,
                    Price = oi.Product.Price,
                    CategoryId = oi.Product.CategoryId,
                    StockAmount = oi.Product.StockAmount,
                    IsVisible = oi.Product.IsVisible,
                    ShippingTypeId = oi.Product.ShippingTypeId,
                    InStock = oi.Product.InStock,
                    Category = new CategoryDto
                    {
                        Id = oi.Product.Category.Id,
                        Name = oi.Product.Category.Name
                    }
                }
            }).ToList()
        };
    }

    #endregion
}

public class OrderStatisticsDto
{
    public int TotalOrders { get; set; }
    public int PendingOrders { get; set; }
    public int ConfirmedOrders { get; set; }
    public int ProcessingOrders { get; set; }
    public int ShippedOrders { get; set; }
    public int DeliveredOrders { get; set; }
    public int CancelledOrders { get; set; }
    public int RefundedOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AverageOrderValue { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public class OrderStatusSummaryDto
{
    public OrderStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal TotalValue { get; set; }
}