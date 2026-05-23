using SportsLeague.DataAccess.Context;
using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace SportsLeague.DataAccess.Repositories
{
    public class MatchLineupRepository : GenericRepository<MatchLineup>, IMatchLineupRepository
    {
        public MatchLineupRepository(LeagueDbContext context) : base(context) { }

        public async Task<IEnumerable<MatchLineup>> GetByMatchAsync(int matchId)
        {
            return await _dbSet
                .Where(ml => ml.MatchId == matchId)
                .Include(ml => ml.Player)
                .ThenInclude(p => p.Team)
                .OrderByDescending(ml => ml.IsStarter)
                .ThenBy(ml => ml.Position)
                .ToListAsync();
        }

        public async Task<IEnumerable<MatchLineup>> GetByMatchAndTeamAsync(int matchId, int teamId)
        {
            return await _dbSet
                .Where(ml => ml.MatchId == matchId && ml.Player.TeamId == teamId)
                .Include(ml => ml.Player)
                .ThenInclude(p => p.Team)
                .OrderByDescending(ml => ml.IsStarter)
                .ThenBy(ml => ml.Position)
                .ToListAsync();
        }

        public async Task<MatchLineup?> GetByMatchAndPlayerAsync(int matchId, int playerId)
        {
            return await _dbSet
                .Where(ml => ml.MatchId == matchId && ml.PlayerId == playerId)
                .Include(ml => ml.Player)
                .ThenInclude(p => p.Team)
                .FirstOrDefaultAsync();
        }

        public async Task<int> CountStartersByTeamInMatchAsync(int matchId, int teamId)
        {
            return await _dbSet
                .Where(ml => ml.MatchId == matchId 
                          && ml.Player.TeamId == teamId 
                          && ml.IsStarter)
                .CountAsync();
        }
    }
}
