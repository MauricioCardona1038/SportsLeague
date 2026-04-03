using Microsoft.Extensions.Logging;
using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Enums;
using SportsLeague.Domain.Interfaces.Repositories;
using SportsLeague.Domain.Interfaces.Services;

namespace SportsLeague.Domain.Services
{
    public class SponsorService : ISponsorService
    {
        private readonly ISponsorRepository _SponsorRepository;
        private readonly ILogger _logger;

        public SponsorService(ISponsorRepository SponsorRepository, ILogger<SponsorService> logger)
        {
            _SponsorRepository = SponsorRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<Sponsor>> GetAllAsync()
        {
            _logger.LogInformation("Retrieving all Sponsors");
            return await _SponsorRepository.GetAllAsync();
        }

        public async Task<Sponsor?> GetByIdAsync(int id)
        {
            _logger.LogInformation("Retrieving Sponsor with ID: {SponsorId}", id);

            var sponsor = await _SponsorRepository.GetByIdAsync(id);

            if (sponsor == null)
                _logger.LogWarning("Sponsor with ID {SponsorId} not found", id);

            return sponsor;
        }

        public async Task<Sponsor> CreateAsync(Sponsor sponsor)
        {
            ValidateSponsor(sponsor);

            // Validación de negocio: nombre único
            var existingSponsor = await _SponsorRepository.GetByNameAsync(sponsor.Name);
            if (existingSponsor != null)
            {
                _logger.LogWarning("Sponsor with name '{SponsorName}' already exists", sponsor.Name);
                throw new InvalidOperationException($"Ya existe un patrocinador con el nombre '{sponsor.Name}'");
            }

            _logger.LogInformation("Creating sponsor: {SponsorName}", sponsor.Name);
            return await _SponsorRepository.CreateAsync(sponsor);
        }

        public async Task UpdateAsync(int id, Sponsor sponsor)
        {
            var existingSponsor = await _SponsorRepository.GetByIdAsync(id);
            if (existingSponsor == null)
            {
                _logger.LogWarning("Sponsor with ID {SponsorId} not found for update", id);
                throw new KeyNotFoundException(
                    $"No se encontró el patrocinador con ID {id}");
            }

            ValidateSponsor(sponsor);

            // Validar nombre único (si cambió)
            if (existingSponsor.Name != sponsor.Name)
            {
                var sponsorWithSameName = await _SponsorRepository.GetByNameAsync(sponsor.Name);
                if (sponsorWithSameName != null)
                {
                    throw new InvalidOperationException(
                        $"Ya existe un patrocinador con el nombre '{sponsor.Name}'");
                }
            }

            existingSponsor.Name = sponsor.Name;
            existingSponsor.ContactEmail = sponsor.ContactEmail;
            existingSponsor.Phone = sponsor.Phone;
            existingSponsor.WebsiteUrl = sponsor.WebsiteUrl;


            _logger.LogInformation("Updating Sponsor with ID: {SponsorId}", id);
            await _SponsorRepository.UpdateAsync(existingSponsor);
        }

        public async Task DeleteAsync(int id)
        {
            var exists = await _SponsorRepository.ExistsAsync(id);
            if (!exists)
            {
                _logger.LogWarning("Sponsor with ID {SponsorId} not found for deletion", id);
                throw new KeyNotFoundException(
                    $"No se encontró el patrocinador con ID {id}");
            }

            _logger.LogInformation("Deleting sponsor with ID: {SponsorId}", id);
            await _SponsorRepository.DeleteAsync(id);
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var mail = new System.Net.Mail.MailAddress(email);
                return mail.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private void ValidateSponsor(Sponsor sponsor)
        {
            if (string.IsNullOrWhiteSpace(sponsor.Name))
                throw new InvalidOperationException("El nombre del sponsor es obligatorio");

            sponsor.Name = sponsor.Name.Trim();

            if (!IsValidEmail(sponsor.ContactEmail))
                throw new InvalidOperationException("El email no tiene un formato válido");

            if (!Enum.IsDefined(typeof(SponsorCategory), sponsor.Category))
                throw new InvalidOperationException("Categoría de sponsor inválida");
        }

    }
}
