using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PokemonReview.Dto;
using PokemonReview.Interfaces;
using PokemonReview.Repository;
using PokemonReviewApp.Models;

namespace PokemonReview.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController: Controller

    {
        private readonly ICountryRepository countryRepository;
        private readonly IMapper mapper;

        public CountryController(ICountryRepository countryRepository,IMapper mapper)
        {
            this.countryRepository = countryRepository;
            this.mapper = mapper;
        }
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Country>))]
        public IActionResult GetCountries()
        {
            var countries = mapper.Map<List<CountryDto>>(countryRepository.GetCountries());
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(countries);
        }
        [HttpGet("{countryId}")]
        [ProducesResponseType(200, Type = typeof(Country))]
        [ProducesResponseType(400)]
        public IActionResult GetPokemon(int countryId)
        {
            if (!countryRepository.CountryExists(countryId))
            {
                return NotFound();
            }
            var country = mapper.Map<PokemonDto>(countryRepository.GetCountry(countryId));
            if (!ModelState.IsValid) 
            {
                return BadRequest(ModelState);
            }
            return Ok(country);
        }
        [HttpGet("owners/{ownerId}")]
        [ProducesResponseType(200, Type = typeof(Owner))]
        [ProducesResponseType(400)]
        public IActionResult GetCountryOfAnOwner(int ownerId)
        {
            var country = mapper.Map<CountryDto>(countryRepository.GetCountryByOwner(ownerId));
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(country);
        }
        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateCountry([FromBody] CountryDto countryCreate)
        {
            if (countryCreate == null)
            {
                return BadRequest(ModelState);
            }
            var country = countryRepository.GetCountries()
               .Where(c => c.Name.Trim().ToUpper() == countryCreate.Name.TrimEnd().ToUpper())
               .FirstOrDefault();
            if (country != null)
            {
                ModelState.AddModelError("", "Category already exists");
                return StatusCode(422, ModelState);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var countryMap = mapper.Map<Country>(countryCreate);
            if (!countryRepository.CreateCountry(countryMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully created");
        }
        [HttpPut("{countryId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateCountry(int countryId, [FromBody] CountryDto updatedCountry)
        {
            if (updatedCountry == null)
                return BadRequest(ModelState);
            if (countryId != updatedCountry.Id)
                return BadRequest(ModelState);
            if (!countryRepository.CountryExists(countryId))
                return NotFound();
            if (!ModelState.IsValid)
                return BadRequest();
            var countryMap = mapper.Map<Country>(updatedCountry);
            if (!countryRepository.UpdateCountry(countryMap))
            {
                ModelState.AddModelError("", "Something went wrong updating category");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully Updated");
        }
        [HttpDelete("{countryId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteCategory(int countryId)
        {
            if (!countryRepository.CountryExists(countryId))
                return NotFound();
            var countryToDelete = countryRepository.GetCountry(countryId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (!countryRepository.DeleteCountry(countryToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting country");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully Deleted");
        }

    }
}
