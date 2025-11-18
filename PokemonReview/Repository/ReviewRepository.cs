using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PokemonReview.Interfaces;
using PokemonReviewApp.Data;
using PokemonReviewApp.Models;

namespace PokemonReview.Repository
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public ReviewRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public bool CreateReview(Review review)
        {
            context.Add(review);
            return Save();
        }

        public bool DeleteReview(Review review)
        {
            context.Remove(review);
            return Save();
        }

        public bool DeleteReviews(List<Review> reviews)
        {
            //To Delete Multiple Reviews,range of values
            context.RemoveRange(reviews);
            return Save();
        }

        public Review GetReview(int reviewId)
        {
            return context.Reviews.Where(r => r.Id == reviewId).FirstOrDefault();
        }

        public ICollection<Review> GetReviews()
        {
            return context.Reviews.ToList();
        }

        public ICollection<Review> GetReviewsOfAPokemon(int pokeId)
        {
           return context.Reviews.Where(r => r.Pokemon.Id == pokeId).ToList();
        }

        public bool ReviewExists(int reviewId)
        {
            return context.Reviews.Any(r => r.Id == reviewId);
        }

        public bool Save()
        {
            var saved = context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool UpdateReview(Review review)
        {
            context.Update(review);
            return Save();
        }
    }
}
