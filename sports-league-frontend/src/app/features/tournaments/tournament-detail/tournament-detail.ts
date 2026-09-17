import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TournamentService } from '../tournament.service';
import { TournamentResponse } from '../tournament.model';
import { TOURNAMENT_STATUS_LABELS } from '../../../shared/enums/tournament-status.enum';
import { TournamentTeamsTab } from './tabs/tournament-teams-tab/tournament-teams-tab';
import { TournamentSponsorsTab } from './tabs/tournament-sponsors-tab/tournament-sponsors-tab';

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TournamentTeamsTab,
    TournamentSponsorsTab,
  ],
  templateUrl: './tournament-detail.html',
  styleUrl: './tournament-detail.scss',
})
export class TournamentDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tournamentService = inject(TournamentService);

  readonly tournament = signal<TournamentResponse | null>(null);
  readonly statusLabels = TOURNAMENT_STATUS_LABELS;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tournamentService.getById(id).subscribe((tournament) => this.tournament.set(tournament));
  }
}
