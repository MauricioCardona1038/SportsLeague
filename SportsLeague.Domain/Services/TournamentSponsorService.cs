using Microsoft.Extensions.Logging;
using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Interfaces.Repositories;
using SportsLeague.Domain.Interfaces.Services;

namespace SportsLeague.Domain.Services
{
    public class TournamentSponsorService : ITournamentSponsorService
    {
        private readonly ITournamentSponsorRepository _tournamentSponsorRepository;
        private readonly ITournamentRepository _tournamentRepository;
        private readonly ISponsorRepository _sponsorRepository;
        private readonly ILogger<TournamentSponsorService> _logger;

        public TournamentSponsorService(
            ITournamentSponsorRepository tournamentSponsorRepository,
            ITournamentRepository tournamentRepository,
            ISponsorRepository sponsorRepository,
            ILogger<TournamentSponsorService> logger)
        {
            _tournamentSponsorRepository = tournamentSponsorRepository;
            _tournamentRepository = tournamentRepository;
            _sponsorRepository = sponsorRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<TournamentSponsor>> GetByTournamentIdAsync(int tournamentId)
        {
            return await _tournamentSponsorRepository.GetByTournamentIdAsync(tournamentId);
        }

        public async Task<TournamentSponsor> AddSponsorToTournamentAsync(
            int tournamentId,
            int sponsorId,
            decimal contractAmount)
        {
            // Validar torneo existe
            if (!await _tournamentRepository.ExistsAsync(tournamentId))
                throw new KeyNotFoundException($"Torneo con ID {tournamentId} no existe");

            // Validar sponsor existe
            if (!await _sponsorRepository.ExistsAsync(sponsorId))
                throw new KeyNotFoundException($"Sponsor con ID {sponsorId} no existe");

            // Validar duplicado
            if (await _tournamentSponsorRepository.ExistsAsync(tournamentId, sponsorId))
                throw new InvalidOperationException("El sponsor ya está vinculado a este torneo");

            // Validar monto
            if (contractAmount <= 0)
                throw new InvalidOperationException("El monto del contrato debe ser mayor a 0");

            var tournamentSponsor = new TournamentSponsor
            {
                TournamentId = tournamentId,
                SponsorId = sponsorId,
                ContractAmount = contractAmount,
                JoinedAt = DateTime.UtcNow
            };

            _logger.LogInformation(
                "Vinculando sponsor {SponsorId} al torneo {TournamentId}",
                sponsorId, tournamentId);

            // Guardar
            await _tournamentSponsorRepository.CreateAsync(tournamentSponsor);

            // VOLVER A CONSULTAR CON INCLUDE
            var created = await _tournamentSponsorRepository
                .GetByTournamentAndSponsorAsync(tournamentId, sponsorId);

            return created!;
        }

        public async Task RemoveSponsorFromTournamentAsync(int tournamentId, int sponsorId)
        {
            var existing = await _tournamentSponsorRepository
                .GetByTournamentAndSponsorAsync(tournamentId, sponsorId);

            if (existing == null)
                throw new KeyNotFoundException("La relación no existe");

            _logger.LogInformation(
                "Eliminando sponsor {SponsorId} del torneo {TournamentId}",
                sponsorId, tournamentId);

            await _tournamentSponsorRepository.DeleteAsync(existing.Id);
        }

        public async Task<IEnumerable<TournamentSponsor>> GetBySponsorIdAsync(int sponsorId)
        {
            if (!await _sponsorRepository.ExistsAsync(sponsorId))
                throw new KeyNotFoundException($"Sponsor con ID {sponsorId} no existe");

            return await _tournamentSponsorRepository.GetBySponsorIdAsync(sponsorId);
        }
    }
}
