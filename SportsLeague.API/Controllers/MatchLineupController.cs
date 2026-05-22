using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportsLeague.API.DTOs.Request;
using SportsLeague.API.DTOs.Response;
using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Interfaces.Services;

namespace SportsLeague.API.Controllers
{
    [ApiController]
    [Route("api/match/{matchId}/lineup")]
    public class MatchLineupController : ControllerBase
    {
        private readonly IMatchLineupService _matchLineupService;
        private readonly IMapper _mapper;

        public MatchLineupController(IMatchLineupService matchLineupService, IMapper mapper)
        {
            _matchLineupService = matchLineupService;
            _mapper = mapper;
        }

        /// <summary>
        /// POST: Agregar un jugador a la alineación de un partido
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<MatchLineupDto>> CreateLineup(int matchId, CreateMatchLineupDto dto)
        {
            try
            {
                var lineup = _mapper.Map<MatchLineup>(dto);

                var result = await _matchLineupService.CreateLineupAsync(matchId, lineup);

                var resultDto = _mapper.Map<MatchLineupDto>(result);
                return CreatedAtAction(nameof(GetLineupByMatch), new { matchId }, resultDto);
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

        /// <summary>
        /// GET: Obtener la alineación completa de un partido
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MatchLineupDto>>> GetLineupByMatch(int matchId)
        {
            try
            {
                var lineups = await _matchLineupService.GetLineupByMatchAsync(matchId);
                var dtos = _mapper.Map<IEnumerable<MatchLineupDto>>(lineups);
                return Ok(dtos);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET: Obtener la alineación filtrada por equipo
        /// </summary>
        [HttpGet("team/{teamId}")]
        public async Task<ActionResult<IEnumerable<MatchLineupDto>>> GetLineupByMatchAndTeam(int matchId, int teamId)
        {
            try
            {
                var lineups = await _matchLineupService.GetLineupByMatchAndTeamAsync(matchId, teamId);
                var dtos = _mapper.Map<IEnumerable<MatchLineupDto>>(lineups);
                return Ok(dtos);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// DELETE: Eliminar un jugador de la alineación
        /// </summary>
        [HttpDelete("{lineupId}")]
        public async Task<ActionResult> DeleteLineup(int matchId, int lineupId)
        {
            try
            {
                await _matchLineupService.DeleteLineupAsync(matchId, lineupId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
