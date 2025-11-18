using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PokemonReview.Dto;
using PokemonReview.Interfaces;
using PokemonReview.Repository;
using PokemonReviewApp.Models;

namespace PokemonReview.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
    [ApiController]
    public class ReviewController: Controller
    {
        private readonly IReviewRepository reviewRepository;
        private readonly IMapper mapper;
        private readonly IPokemonRepository pokemonRepository;
        private readonly IReviewerRepository reviewerRepository;

        public ReviewController(IReviewRepository reviewRepository,IMapper mapper,IPokemonRepository pokemonRepository,IReviewerRepository reviewerRepository)
        {
            this.reviewRepository = reviewRepository;
            this.mapper = mapper;
            this.pokemonRepository = pokemonRepository;
            this.reviewerRepository = reviewerRepository;
        }
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Review>))]
        public IActionResult GetReviews()
        {
            var reviews = mapper.Map<List<ReviewDto>>(reviewRepository.GetReviews());
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(reviews);
        }
        [HttpGet("{reviewId}")]
        [ProducesResponseType(200, Type = typeof(Review))]
        [ProducesResponseType(400)]
        public IActionResult GetReview(int reviewId)
        {
            if (!reviewRepository.ReviewExists(reviewId))
            {
                return NotFound();
            }
            var review = mapper.Map<ReviewDto>(reviewRepository.GetReview(reviewId));
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(review);

        }
        [HttpGet("pokemon/{pokeId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Review>))]
        [ProducesResponseType(400)]
        public IActionResult GetReviewsOfAPokemon(int pokeId)
        {
            var reviews = mapper.Map<List<ReviewDto>>(reviewRepository.GetReviewsOfAPokemon(pokeId));
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(reviews);
        }
        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateReview([FromQuery]int reviewerId,[FromQuery] int pokeId,[FromBody] ReviewDto reviewCreate)
        {
            if (reviewCreate == null)
            {
                return BadRequest(ModelState);
            }
            var reviews = reviewRepository.GetReviews()
               .Where(c => c.Title.Trim().ToUpper() == reviewCreate.Title.TrimEnd().ToUpper())
               .FirstOrDefault();
            if (reviews != null)
            {
                ModelState.AddModelError("", "Review already exists");
                return StatusCode(422, ModelState);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var reviewMap = mapper.Map<Review>(reviewCreate);
            reviewMap.Pokemon = pokemonRepository.GetPokemon(pokeId);
            reviewMap.Reviewer = reviewerRepository.GetReviewer(reviewerId);


            if (!reviewRepository.CreateReview(reviewMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully created");
        }
        [HttpPut("{reviewId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateOwner(int reviewId, [FromBody] ReviewDto updatedReview)
        {
            if (updatedReview == null)
                return BadRequest(ModelState);
            if (reviewId != updatedReview.Id)
                return BadRequest(ModelState);
            if (!reviewRepository.ReviewExists(reviewId))
                return NotFound();
            if (!ModelState.IsValid)
                return BadRequest();
            var reviewMap = mapper.Map<Review>(updatedReview);
            if (!reviewRepository.UpdateReview(reviewMap))
            {
                ModelState.AddModelError("", "Something went wrong updating review");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully Updated");
        }
        [HttpDelete("{reviewId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteReview(int reviewId)
        {
            if (!reviewRepository.ReviewExists(reviewId))
                return NotFound();
            var reviewToDelete = reviewRepository.GetReview(reviewId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (!reviewRepository.DeleteReview(reviewToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting review");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully Deleted");
        }
    }
}
