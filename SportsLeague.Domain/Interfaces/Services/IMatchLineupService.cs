using SportsLeague.Domain.Entities;

namespace SportsLeague.Domain.Interfaces.Services
{
    public interface IMatchLineupService
    {
        Task<MatchLineup> CreateLineupAsync(int matchId, MatchLineup lineup);
        Task<IEnumerable<MatchLineup>> GetLineupByMatchAsync(int matchId);
        Task<IEnumerable<MatchLineup>> GetLineupByMatchAndTeamAsync(int matchId, int teamId);
        Task DeleteLineupAsync(int matchId, int lineupId);
    }
}
