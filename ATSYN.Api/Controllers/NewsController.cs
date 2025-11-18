using ATSYN.Data.Data;
using ATSYN.Data.Data.Entities.News;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ATSYN.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewsDto>>> GetAllNews()
        {
            var news = await _context.News
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NewsDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Content = n.Content,
                    CreatedAt = n.CreatedAt
                })
                .ToListAsync();

            return Ok(news);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NewsDto>> GetNewsById(int id)
        {
            var news = await _context.News.FindAsync(id);

            if (news == null) 
            {
                return NotFound();
            }

            var newsDto = new NewsDto
            {
                Id = news.Id,
                Title = news.Title,
                Content = news.Content,
                CreatedAt = news.CreatedAt,
            };
            return Ok(newsDto);
        }

        [HttpPost]
        public async Task<ActionResult<NewsDto>> CreateNews(CreateNewsDto createDto)
        {
            var news = new News
            {
                Title = createDto.Title,
                Content = createDto.Content,
                CreatedAt = DateTime.UtcNow,
            };

            _context.News.Add(news);
            await _context.SaveChangesAsync();

            var newsDto = new NewsDto
            {
                Id = news.Id,
                Title = news.Title,
                Content = news.Content,
                CreatedAt = DateTime.UtcNow,
            };

            // return CreatedAtAction(nameof(GetNewsById), new {id = news.Id, newsDto});
            return Ok(newsDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNews(int id, UpdateNewsDto updateDto)
        {
            var news = await _context.News.FindAsync(id);

            if (news == null) { return NotFound(); }

            news.Title = updateDto.Title;
            news.Content = updateDto.Content;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) 
            {
                if (!await NewsExists(id))
                {
                    return NotFound();
                }
                throw;
            }
            
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNews(int id)
        {
            var news = await _context.News.FindAsync(id);

            if(news == null) { return NotFound();}

            _context.News.Remove(news);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private async Task<bool> NewsExists(int id)
        {
         return await _context.News.AnyAsync(e => e.Id == id);
        }
    }
}
