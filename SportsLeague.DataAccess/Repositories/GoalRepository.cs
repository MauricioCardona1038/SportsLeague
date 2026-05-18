using SportsLeague.DataAccess.Context;
using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace SportsLeague.DataAccess.Repositories
{
    public class GoalRepository : GenericRepository<Goal>, IGoalRepository

    {

        public GoalRepository(LeagueDbContext context) : base(context) { }


        public async Task<IEnumerable<Goal>> GetByMatchAsync(int matchId)

        {

            return await _dbSet

            .Where(g => g.MatchId == matchId)

            .OrderBy(g => g.Minute) // Ordenar de forma ascendente por el minuto del gol

            //.OrderByDescending(g => g.Type) // Ordenar de forma descendente por el tipo de gol (penalti, jugada, etc.)

            .ToListAsync();

        }


        public async Task<IEnumerable<Goal>> GetByMatchWithDetailsAsync(int matchId)

        {

            return await _dbSet

            .Where(g => g.MatchId == matchId)

            .Include(g => g.Player)
            //.ThenInclude(p => p.Team)              cuando quiero mas detalles, como el equipo del jugador
            //.ThenInclude(t => t.TournamentTeams) cuando quiero más detalles, como los torneos en los que participa el equipo del jugador
            //.ThenInclude(tt => tt.Tournament) cuando quiero más detalles, como los torneos en los que participa el equipo del jugador 

            .OrderBy(g => g.Minute)

            .ToListAsync();

        }

    }
}
