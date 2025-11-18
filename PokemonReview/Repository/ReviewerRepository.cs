using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PokemonReview.Interfaces;
using PokemonReviewApp.Data;
using PokemonReviewApp.Models;

namespace PokemonReview.Repository
{
    public class ReviewerRepository : IReviewerRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public ReviewerRepository(DataContext context,IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public bool CreateReviewer(Reviewer reviewer)
        {
            context.Add(reviewer);
            return Save();
        }

        public bool DeleteReviewer(Reviewer reviewer)
        {
            context.Remove(reviewer);
            return Save();
        }

        public Reviewer GetReviewer(int reviewerId)
        {
            return context.Reviewers.Where(r => r.Id == reviewerId).Include(e=>e.Reviews).FirstOrDefault();
        }

        public ICollection<Reviewer> GetReviewers()
        {
           return context.Reviewers.ToList();
        }

        public ICollection<Review> GetReviewsByReviewer(int reviewerId)
        {
            return context.Reviews.Where(r => r.Reviewer.Id == reviewerId).ToList();
        }

        public bool ReviewerExists(int reviewerId)
        {
            return context.Reviewers.Any(r => r.Id == reviewerId);
        }

        public bool Save()
        {
            var saved = context.SaveChanges();
            return saved > 0 ? true : false;
        }

        public bool UpdateReviewer(Reviewer reviewer)
        {
            context.Update(reviewer);
            return Save();
        }
    }
}
