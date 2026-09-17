import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'torneos', pathMatch: 'full' },

  { path: 'torneos', loadComponent: () => import('./features/tournaments/tournament-list/tournament-list').then((m) => m.TournamentList) },
  { path: 'torneos/nuevo', loadComponent: () => import('./features/tournaments/tournament-form/tournament-form').then((m) => m.TournamentForm) },
  { path: 'torneos/:id/editar', loadComponent: () => import('./features/tournaments/tournament-form/tournament-form').then((m) => m.TournamentForm) },
  { path: 'torneos/:id', loadComponent: () => import('./features/tournaments/tournament-detail/tournament-detail').then((m) => m.TournamentDetail) },

  { path: 'arbitros', loadComponent: () => import('./features/referees/referee-list/referee-list').then((m) => m.RefereeList) },
  { path: 'arbitros/nuevo', loadComponent: () => import('./features/referees/referee-form/referee-form').then((m) => m.RefereeForm) },
  { path: 'arbitros/:id/editar', loadComponent: () => import('./features/referees/referee-form/referee-form').then((m) => m.RefereeForm) },

  { path: 'patrocinadores', loadComponent: () => import('./features/sponsors/sponsor-list/sponsor-list').then((m) => m.SponsorList) },
  { path: 'patrocinadores/nuevo', loadComponent: () => import('./features/sponsors/sponsor-form/sponsor-form').then((m) => m.SponsorForm) },
  { path: 'patrocinadores/:id/editar', loadComponent: () => import('./features/sponsors/sponsor-form/sponsor-form').then((m) => m.SponsorForm) },

  { path: 'equipos', loadComponent: () => import('./features/teams/team-list/team-list').then((m) => m.TeamList) },
  { path: 'equipos/nuevo', loadComponent: () => import('./features/teams/team-form/team-form').then((m) => m.TeamForm) },
  { path: 'equipos/:id/editar', loadComponent: () => import('./features/teams/team-form/team-form').then((m) => m.TeamForm) },

  { path: 'jugadores', loadComponent: () => import('./features/players/player-list/player-list').then((m) => m.PlayerList) },
  { path: 'jugadores/nuevo', loadComponent: () => import('./features/players/player-form/player-form').then((m) => m.PlayerForm) },
  { path: 'jugadores/:id/editar', loadComponent: () => import('./features/players/player-form/player-form').then((m) => m.PlayerForm) },

  { path: 'partidos', loadComponent: () => import('./features/matches/match-list/match-list').then((m) => m.MatchList) },
  { path: 'partidos/nuevo', loadComponent: () => import('./features/matches/match-form/match-form').then((m) => m.MatchForm) },
  { path: 'partidos/:id/editar', loadComponent: () => import('./features/matches/match-form/match-form').then((m) => m.MatchForm) },
  { path: 'partidos/:id', loadComponent: () => import('./features/matches/match-detail/match-detail').then((m) => m.MatchDetail) },

  { path: 'estadisticas', loadComponent: () => import('./features/standings/standings-dashboard/standings-dashboard').then((m) => m.StandingsDashboard) },

  { path: '**', redirectTo: 'torneos' },
];
