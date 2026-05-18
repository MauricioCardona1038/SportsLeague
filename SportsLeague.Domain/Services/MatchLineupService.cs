using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Enums;
using SportsLeague.Domain.Helpers;
using SportsLeague.Domain.Interfaces.Repositories;
using SportsLeague.Domain.Interfaces.Services;

namespace SportsLeague.Domain.Services
{
    public class MatchLineupService : IMatchLineupService
    {
        private readonly IMatchLineupRepository _matchLineupRepository;
        private readonly IMatchRepository _matchRepository;
        private readonly IPlayerRepository _playerRepository;
        private readonly MatchValidationHelper _validationHelper;

        public MatchLineupService(
            IMatchLineupRepository matchLineupRepository,
            IMatchRepository matchRepository,
            IPlayerRepository playerRepository,
            MatchValidationHelper validationHelper)
        {
            _matchLineupRepository = matchLineupRepository;
            _matchRepository = matchRepository;
            _playerRepository = playerRepository;
            _validationHelper = validationHelper;
        }

        public async Task<MatchLineup> CreateLineupAsync(int matchId, MatchLineup lineup)
        {
            // V1: El partido debe existir
            var match = await _matchRepository.GetByIdAsync(matchId);
            if (match == null)
                throw new KeyNotFoundException($"No se encontró el partido con ID {matchId}");

            // V6: El partido debe estar en estado Scheduled
            if (match.Status != MatchStatus.Scheduled)
                throw new InvalidOperationException("Solo se pueden registrar alineaciones en partidos Scheduled");

            // V2: El jugador debe existir
            var player = await _playerRepository.GetByIdAsync(lineup.PlayerId);
            if (player == null)
                throw new KeyNotFoundException($"No se encontró el jugador con ID {lineup.PlayerId}");

            // V3: El jugador debe pertenecer al HomeTeam o AwayTeam del partido
            if (player.TeamId != match.HomeTeamId && player.TeamId != match.AwayTeamId)
                throw new InvalidOperationException("El jugador no pertenece a ninguno de los equipos del partido");

            // V4: El jugador no puede estar registrado dos veces en la misma alineación
            var existingLineup = await _matchLineupRepository.GetByMatchAndPlayerAsync(matchId, lineup.PlayerId);
            if (existingLineup != null)
                throw new InvalidOperationException("El jugador ya está registrado en la alineación de este partido");

            // V5: Máximo 11 titulares por equipo por partido
            if (lineup.IsStarter)
            {
                var startersCount = await _matchLineupRepository.CountStartersByTeamInMatchAsync(matchId, player.TeamId);
                if (startersCount >= 11)
                    throw new InvalidOperationException("El equipo ya tiene 11 titulares registrados en este partido");
            }

            // Asignar el matchId y crear la alineación
            lineup.MatchId = matchId;

            return await _matchLineupRepository.CreateAsync(lineup);
        }

        public async Task<IEnumerable<MatchLineup>> GetLineupByMatchAsync(int matchId)
        {
            // Verificar que el partido existe
            var match = await _matchRepository.GetByIdAsync(matchId);
            if (match == null)
                throw new KeyNotFoundException($"No se encontró el partido con ID {matchId}");

            return await _matchLineupRepository.GetByMatchAsync(matchId);
        }

        public async Task<IEnumerable<MatchLineup>> GetLineupByMatchAndTeamAsync(int matchId, int teamId)
        {
            // Verificar que el partido existe
            var match = await _matchRepository.GetByIdAsync(matchId);
            if (match == null)
                throw new KeyNotFoundException($"No se encontró el partido con ID {matchId}");

            return await _matchLineupRepository.GetByMatchAndTeamAsync(matchId, teamId);
        }

        public async Task DeleteLineupAsync(int matchId, int lineupId)
        {
            // Verificar que el partido existe
            var match = await _matchRepository.GetByIdAsync(matchId);
            if (match == null)
                throw new KeyNotFoundException($"No se encontró el partido con ID {matchId}");

            // Verificar que la alineación existe
            var lineup = await _matchLineupRepository.GetByIdAsync(lineupId);
            if (lineup == null || lineup.MatchId != matchId)
                throw new KeyNotFoundException($"No se encontró la alineación con ID {lineupId} en el partido {matchId}");

            await _matchLineupRepository.DeleteAsync(lineupId);
        }
    }
}
