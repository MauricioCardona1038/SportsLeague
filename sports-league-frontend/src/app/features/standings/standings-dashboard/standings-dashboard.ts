import { Component, OnInit, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { TournamentService } from '../../tournaments/tournament.service';
import { TournamentResponse } from '../../tournaments/tournament.model';
import { StandingsTableTab } from './tabs/standings-table-tab/standings-table-tab';
import { TopScorersTab } from './tabs/top-scorers-tab/top-scorers-tab';
import { CardStatsTab } from './tabs/card-stats-tab/card-stats-tab';

@Component({
  selector: 'app-standings-dashboard',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatTabsModule, StandingsTableTab, TopScorersTab, CardStatsTab],
  templateUrl: './standings-dashboard.html',
  styleUrl: './standings-dashboard.scss',
})
export class StandingsDashboard implements OnInit {
  private readonly tournamentService = inject(TournamentService);

  readonly tournaments = signal<TournamentResponse[]>([]);
  readonly selectedTournamentId = signal<number | null>(null);

  ngOnInit(): void {
    this.tournamentService.getAll().subscribe((tournaments) => this.tournaments.set(tournaments));
  }
}
