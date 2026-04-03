using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportsLeague.API.DTOs.Request;
using SportsLeague.API.DTOs.Response;
using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Interfaces.Services;

namespace SportsLeague.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TournamentSponsorController : ControllerBase
    {
        private readonly ITournamentSponsorService _tournamentSponsorService;
        private readonly IMapper _mapper;
        private readonly ILogger<TournamentSponsorController> _logger;

        public TournamentSponsorController(
            ITournamentSponsorService tournamentSponsorService,
            IMapper mapper,
            ILogger<TournamentSponsorController> logger)
        {
            _tournamentSponsorService = tournamentSponsorService;
            _mapper = mapper;
            _logger = logger;
        }

        // Vincular sponsor a torneo
        [HttpPost]
        public async Task<ActionResult<TournamentSponsorResponseDTO>> AddSponsorToTournament(TournamentSponsorRequestDTO dto)
        {
            try
            {
                var result = await _tournamentSponsorService.AddSponsorToTournamentAsync(
                    dto.TournamentId,
                    dto.SponsorId,
                    dto.ContractAmount);

                var response = _mapper.Map<TournamentSponsorResponseDTO>(result);
                return Ok(response);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        // Desvincular sponsor de torneo
        [HttpDelete]
        public async Task<ActionResult> RemoveSponsorFromTournament(int tournamentId, int sponsorId)
        {
            try
            {
                await _tournamentSponsorService.RemoveSponsorFromTournamentAsync(tournamentId, sponsorId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Listar sponsors de un torneo
        [HttpGet("tournament/{tournamentId}")]
        public async Task<ActionResult<IEnumerable<TournamentSponsorResponseDTO>>> GetSponsorsByTournament(int tournamentId)
        {
            var result = await _tournamentSponsorService.GetByTournamentIdAsync(tournamentId);
            return Ok(_mapper.Map<IEnumerable<TournamentSponsorResponseDTO>>(result));
        }

        // Listar torneos de un sponsor
        [HttpGet("sponsor/{sponsorId}")]
        public async Task<ActionResult<IEnumerable<TournamentSponsorResponseDTO>>> GetTournamentsBySponsor(int sponsorId)
        {
            var result = await _tournamentSponsorService.GetBySponsorIdAsync(sponsorId);
            return Ok(_mapper.Map<IEnumerable<TournamentSponsorResponseDTO>>(result));
        }
    }
}
