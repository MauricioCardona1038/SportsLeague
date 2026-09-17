import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatchService } from '../match.service';
import { MatchResponse } from '../match.model';
import { MATCH_STATUS_LABELS } from '../../../shared/enums/match-status.enum';
import { MatchResultTab } from './tabs/match-result-tab/match-result-tab';
import { MatchGoalsTab } from './tabs/match-goals-tab/match-goals-tab';
import { MatchCardsTab } from './tabs/match-cards-tab/match-cards-tab';
import { MatchLineupTab } from './tabs/match-lineup-tab/match-lineup-container';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatchResultTab,
    MatchGoalsTab,
    MatchCardsTab,
    MatchLineupTab,
  ],
  templateUrl: './match-detail.html',
  styleUrl: './match-detail.scss',
})
export class MatchDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly matchService = inject(MatchService);

  readonly match = signal<MatchResponse | null>(null);
  readonly statusLabels = MATCH_STATUS_LABELS;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.matchService.getById(id).subscribe((match) => this.match.set(match));
  }
}
