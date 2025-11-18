using PokemonReviewApp.Models;

namespace PokemonReview.Interfaces
{
    public interface ICategoryRepository
    {
        ICollection<PokemonReviewApp.Models.Category> GetCategories();
        Category GetCategory(int id);
        ICollection<Pokemon>GetPokemonByCategory(int categoryId);
        bool CategoryExists(int id);
        bool CreateCategory(Category category);
        bool UpdateCategory(Category category);
        bool DeleteCategory(Category category);
        bool Save();
    }
}
