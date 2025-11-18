using Microsoft.EntityFrameworkCore;
using PokemonReview.Interfaces;
using PokemonReviewApp.Data;
using PokemonReviewApp.Models;

namespace PokemonReview.Repository
{
    public class OwnerRepository : IOwnerRepository
    {
        private readonly DataContext context;

        public OwnerRepository(DataContext context)
        {
            this.context = context;
        }

        public bool CreateOwner(Owner owner)
        {
            context.Add(owner);
            return Save();
        }

        public bool DeleteOwner(Owner owner)
        {
            context.Remove(owner);
            return Save();
        }

        public Owner GetOwner(int ownerId)
        {
            return context.Owners.Where(o => o.Id == ownerId).FirstOrDefault();
        }

        public ICollection<Owner> GetOwnerOfAPokemon(int pokeId)
        {
            return context.PokemonOwners.Where(p => p.Pokemon.Id == pokeId).Select(o => o.Owner).ToList();
        }

        public ICollection<Owner> GetOwners()
        {
            return context.Owners.ToList();
        }

        public ICollection<Pokemon> GetPokemonByOwner(int ownerId)
        {
            return context.PokemonOwners.Where(o => o.Owner.Id == ownerId).Select(p => p.Pokemon).ToList();
        }

        public bool OwnerExists(int ownerId)
        {
            return context.Owners.Any(o => o.Id == ownerId);
        }

        public bool Save()
        {
            var saved = context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool UpdateOwner(Owner owner)
        {
            context.Update(owner);
            return Save();
        }
    }
}
