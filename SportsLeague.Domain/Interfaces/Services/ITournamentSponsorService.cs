using SportsLeague.Domain.Entities;

namespace SportsLeague.Domain.Interfaces.Services
{
    public interface ITournamentSponsorService
    {
        Task<IEnumerable<TournamentSponsor>> GetByTournamentIdAsync(int tournamentId);
        Task<TournamentSponsor> AddSponsorToTournamentAsync(
            int tournamentId,
            int sponsorId,
            decimal contractAmount);
        Task RemoveSponsorFromTournamentAsync(int tournamentId, int sponsorId);

        Task<IEnumerable<TournamentSponsor>> GetBySponsorIdAsync(int sponsorId);
    }
}