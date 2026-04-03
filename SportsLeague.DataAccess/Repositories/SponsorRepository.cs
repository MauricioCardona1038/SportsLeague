using Microsoft.EntityFrameworkCore;
using SportsLeague.DataAccess.Context;
using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Interfaces.Repositories;

namespace SportsLeague.DataAccess.Repositories
{
    public class SponsorRepository : GenericRepository<Sponsor>, ISponsorRepository
    {

        public SponsorRepository(LeagueDbContext context) : base(context)
        {
        }

        public async Task<bool> ExistsByNameAsync(string name)
        {
            var normalized = name.Trim().ToLower();
            return await _context.Sponsors
                .AnyAsync(s => s.Name.ToLower() == normalized);
        }

        public async Task<Sponsor?> GetByNameAsync(string name)
        {
            var normalized = name.Trim().ToLower();
            return await _context.Sponsors
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Name.ToLower() == normalized);
        }
    }
}
