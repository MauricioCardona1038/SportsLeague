using System;
using System.Collections.Generic;
using System.Text;
using SportsLeague.Domain.Entities;

namespace SportsLeague.Domain.Interfaces.Repositories
{
    public interface IRefereeRepository : IGenericRepository<Referee>
    {
        Task<IEnumerable<Referee>> GetByNationalityAsync(string nationality);
    }

}
