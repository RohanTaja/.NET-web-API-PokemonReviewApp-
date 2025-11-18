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
    public class OwnerController: Controller
    {
        private readonly IOwnerRepository ownerRepository;
        private readonly ICountryRepository countryRepository;
        private readonly IMapper mapper;

        public OwnerController(IOwnerRepository ownerRepository,ICountryRepository countryRepository, IMapper mapper)
        {
            this.ownerRepository = ownerRepository;
            this.countryRepository = countryRepository;
            this.mapper = mapper;
        }
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Owner>))]
        public IActionResult GetOwners()
        {
            var owners = mapper.Map<List<OwnerDto>>(ownerRepository.GetOwners());
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(owners);
        }
        [HttpGet("{ownerId}")]
        [ProducesResponseType(200, Type = typeof(Owner))]
        [ProducesResponseType(400)]
        public IActionResult GetOwner(int ownerId)
        {
            if (!ownerRepository.OwnerExists(ownerId))
            {
                return NotFound();
            }
            var owner = mapper.Map<OwnerDto>(ownerRepository.GetOwner(ownerId));
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(owner);

        }
        [HttpGet("{ownerId}/pokemon")]
        [ProducesResponseType(200, Type = typeof(Owner))]
        [ProducesResponseType(400)]
        public IActionResult GetPokemonByOwner(int ownerId)
        {
            if (!ownerRepository.OwnerExists(ownerId))
            {
                return NotFound();
            }
            var owner = mapper.Map<List<PokemonDto>>(ownerRepository.GetPokemonByOwner(ownerId));
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            return Ok(owner);
        }
        [HttpPost]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult CreateOwner([FromQuery] int countryId,[FromBody] OwnerDto ownerCreate)
        {
            if (ownerCreate == null)
            {
                return BadRequest(ModelState);
            }
            var owners = ownerRepository.GetOwners()
               .Where(c => c.LastName.Trim().ToUpper() == ownerCreate.LastName.TrimEnd().ToUpper())
               .FirstOrDefault();
            if (owners != null)
            {
                ModelState.AddModelError("", "Owner already exists");
                return StatusCode(422, ModelState);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var ownerMap = mapper.Map<Owner>(ownerCreate);
            ownerMap.Country = countryRepository.GetCountry(countryId);
            if (!ownerRepository.CreateOwner(ownerMap))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully created");
        }
        [HttpPut("{ownerId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult UpdateOwner(int ownerId, [FromBody] OwnerDto updatedOwner)
        {
            if (updatedOwner == null)
                return BadRequest(ModelState);
            if (ownerId != updatedOwner.Id)
                return BadRequest(ModelState);
            if (!ownerRepository.OwnerExists(ownerId))
                return NotFound();
            if (!ModelState.IsValid)
                return BadRequest();
            var ownerMap = mapper.Map<Owner>(updatedOwner);
            if (!ownerRepository.UpdateOwner(ownerMap))
            {
                ModelState.AddModelError("", "Something went wrong updating category");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully Updated");
        }
        [HttpDelete("{ownerId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteOwner(int ownerId)
        {
            if (!ownerRepository.OwnerExists(ownerId))
                return NotFound();
            var ownerToDelete = ownerRepository.GetOwner(ownerId);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (!ownerRepository.DeleteOwner(ownerToDelete))
            {
                ModelState.AddModelError("", "Something went wrong deleting owner");
                return StatusCode(500, ModelState);
            }
            return Ok("Successfully Deleted");
        }
    }
}
