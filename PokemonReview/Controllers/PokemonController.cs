using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PokemonReview.Dto;
using PokemonReview.Interfaces;
using PokemonReview.Repository;
using PokemonReviewApp.Models;
using System.Collections.Generic;

namespace PokemonReview.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
    [ApiController]
    public class PokemonController : Controller
    {
        private readonly IPokemonRepository pokemonRepository;
        private readonly IMapper mapper;
        private readonly IReviewRepository reviewRepository;

        public PokemonController(IPokemonRepository pokemonRepository,IMapper mapper
           ,IReviewRepository reviewRepository)
        {
            this.pokemonRepository = pokemonRepository;
            this.mapper= mapper;
            this.reviewRepository = reviewRepository;
        }
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Pokemon>))]
        public IActionResult GetPokemons()
        {
            var pokemons = mapper.Map<List<PokemonDto>>(pokemonRepository.GetPokemons());
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(pokemons);
        }
        [HttpGet("{pokeId}")]
        [ProducesResponseType(200, Type = typeof(Pokemon))]
        [ProducesResponseType(400)]
        public IActionResult GetPokemon(int pokeId)
        {
            if (!pokemonRepository.PokemonExists(pokeId))
            {
                return NotFound();
            }
            var pokemon = mapper.Map<PokemonDto>(pokemonRepository.GetPokemon(pokeId));
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(pokemon);

        }
        [HttpGet("rating/{pokeId}")]
        [ProducesResponseType(200, Type = typeof(decimal))]
        [ProducesResponseType(400)]
        public IActionResult GetPokemonRating(int pokeId)
        {
            if (!pokemonRepository.PokemonExists(pokeId))
            {
                return NotFound();
            }
            var rating = pokemonRepository.GetPokemonRating(pokeId);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(rating);
        }
        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreatePokemon([FromQuery] int ownerId,[FromQuery] int catId, [FromBody] PokemonDto pokemonCreate)
        {
            if (pokemonCreate == null)
            {
                return BadRequest(ModelState);
            }
            var pokemons = pokemonRepository.GetPokemons()
               .Where(c => c.Name.Trim().ToUpper() == pokemonCreate.Name.TrimEnd().ToUpper())
               .FirstOrDefault();
            if (pokemons != null)
            {
                ModelState.AddModelError("", "Pokemon already exists");
                return StatusCode(422, ModelState);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var pokemonMap = mapper.Map<Pokemon>(pokemonCreate);
         
            if (!pokemonRepository.CreatePokemon(ownerId,catId,pokemonMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully created");
        }
        [HttpPut("{pokeId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdatePokemon(int pokeId,[FromQuery]int ownerId,[FromQuery] int catId,[FromBody] PokemonDto updatedPokemon)
        {
            if (updatedPokemon == null)
                return BadRequest(ModelState);
            if (pokeId != updatedPokemon.Id)
                return BadRequest(ModelState);
            if (!pokemonRepository.PokemonExists(pokeId))
                return NotFound();
            if (!ModelState.IsValid)
                return BadRequest();
            var pokemonMap = mapper.Map<Pokemon>(updatedPokemon);
            if (!pokemonRepository.UpdatePokemon(ownerId,catId,pokemonMap))
            {
                ModelState.AddModelError("", "Something went wrong updating category");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully Updated");
        }
        [HttpDelete("{pokeId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeletePokemon(int pokeId)
        {
            if (!pokemonRepository.PokemonExists(pokeId))
                return NotFound();
            var reviewsToDelete = reviewRepository.GetReviewsOfAPokemon(pokeId);
            var pokemonToDelete = pokemonRepository.GetPokemon(pokeId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if(!reviewRepository.DeleteReviews(reviewsToDelete.ToList()))
            {
                ModelState.AddModelError("", "Something went wrong deleting reviews");
                return StatusCode(500, ModelState);
            }
            if (!pokemonRepository.DeletePokemon(pokemonToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting pokemon");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully Deleted");
        }
    }
}