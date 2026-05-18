using System;
using System.Collections.Generic;
using System.Text;

namespace SportsLeague.Domain.Interfaces.Services
{
    public interface IStandingsService
    {
        // keyword 'Object' se utiliza para indicar que el método puede devolver cualquier tipo de dato.
        // En este caso, se espera que devuelva un objeto que contenga la información de las posiciones,
        // los goleadores y las estadísticas de tarjetas para un torneo específico.
        Task<object> GetStandingsAsync(int tournamentId);
        Task<object> GetTopScorersAsync(int tournamentId);
        Task<object> GetCardStatsAsync(int tournamentId);

    }
}
