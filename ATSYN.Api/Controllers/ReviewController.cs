using ATSYN.Data.Data;
using ATSYN.Data.Data.Entities.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ATSYN.Api.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewController(ApplicationDbContext context)
        {
            _context = context;
        }

    //endpoint to get the reviews made by a specific user
    //might be changed to get the reviews of the logged in user
    [HttpGet("my-reviews")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsLoggedIn()
    {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated.");

            var reviews = await _context.Reviews
                .Where(r => r.UserId == userId)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    Rating = r.Rating,
                    Title = r.Title,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    UserName = r.User.UserName,
                    ProductTitle = r.Product.Title
                })
                .ToListAsync();

            if (reviews == null || reviews.Count == 0)
            {
                return NotFound($"No reviews found for user with ID {userId}.");
            }
            return Ok(reviews);
    }

    //endpoint for creating a review (user must be logged in)
    [HttpPost]
    [Authorize]

    public async Task<IActionResult> CreateReview (CreateReviewDto createReviewDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var review = new Review
            {
                ProductId = createReviewDto.ProductId,
                UserId = userId,
                Rating = createReviewDto.Rating,
                Title = createReviewDto.Title,
                Comment = createReviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok();
        }



        //endpoint for deleting a review (this might be a bit challenging)
        //two types of deletions: user can only delete their own reviews, admin can delete any review

        //endpoint to get all reviews? (probably only make this for testing)
        //probably will change drastically later
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _context.Reviews
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    Rating = r.Rating,
                    Title = r.Title,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    UserName = r.User.UserName,
                    ProductTitle = r.Product.Title
                })
                .ToListAsync();
            return Ok(reviews);

        }
        //endpoint for all reviews on a specific product (main goal)
        //I think only deleting and creating reviews would require an user to be logged in


    } 
}
