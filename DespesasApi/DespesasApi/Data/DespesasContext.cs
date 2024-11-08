using Microsoft.EntityFrameworkCore;
using DespesasApi.Models;

namespace DespesasApi.Data
{
    public class DespesasContext : DbContext
    {
        public DespesasContext(DbContextOptions<DespesasContext> options)
            : base(options)
        {
        }

        public DbSet<Despesa> Despesas { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
