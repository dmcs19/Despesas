using DespesasApi.Models;

namespace DespesasApi.Data
{
    public interface IUserRepository
    {
        Task<bool> UserExistsAsync(string username);
        Task CreateUserAsync(User user);
        Task<User> ValidateUser(string username, string password);
    }

}
