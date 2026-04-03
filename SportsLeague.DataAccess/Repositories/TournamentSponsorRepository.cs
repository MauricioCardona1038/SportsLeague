using Microsoft.EntityFrameworkCore;
using SportsLeague.DataAccess.Context;
using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Interfaces.Repositories;

namespace SportsLeague.DataAccess.Repositories
{
    public class TournamentSponsorRepository
        : GenericRepository<TournamentSponsor>, ITournamentSponsorRepository
    {
        public TournamentSponsorRepository(LeagueDbContext context)
            : base(context)
        {
        }

        public async Task<IEnumerable<TournamentSponsor>> GetByTournamentIdAsync(int tournamentId)
        {
            return await _context.TournamentSponsors
                .Where(ts => ts.TournamentId == tournamentId)
                .Include(ts => ts.Sponsor) 
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<TournamentSponsor>> GetBySponsorIdAsync(int sponsorId)
        {
            return await _context.TournamentSponsors
                .Where(ts => ts.SponsorId == sponsorId)
                .Include(ts => ts.Tournament)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<TournamentSponsor?> GetByTournamentAndSponsorAsync(int tournamentId, int sponsorId)
        {
            return await _context.TournamentSponsors
                .Include(ts => ts.Sponsor)
                .Include(ts => ts.Tournament)
                .FirstOrDefaultAsync(ts =>
                    ts.TournamentId == tournamentId &&
                    ts.SponsorId == sponsorId);
        }

        public async Task<bool> ExistsAsync(int tournamentId, int sponsorId)
        {
            return await _context.TournamentSponsors
                .AnyAsync(ts =>
                    ts.TournamentId == tournamentId &&
                    ts.SponsorId == sponsorId);
        }
    }
}
