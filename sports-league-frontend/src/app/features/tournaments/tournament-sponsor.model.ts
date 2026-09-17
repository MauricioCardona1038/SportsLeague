export interface TournamentSponsorRequest {
  tournamentId: number;
  contractAmount: number;
}

export interface TournamentSponsorResponse {
  tournamentId: number;
  tournamentName: string;
  sponsorId: number;
  sponsorName: string;
  sponsorCategory: string; // SponsorCategoryName, ej. "Gold" -- misma asimetría que Sponsor
  contractAmount: number;
  joinedAt: string;
}
