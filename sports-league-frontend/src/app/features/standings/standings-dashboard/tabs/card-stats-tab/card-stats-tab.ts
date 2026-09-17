import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { StandingsService } from '../../../standings.service';
import { CardStatsRow } from '../../../standings.model';

@Component({
  selector: 'app-card-stats-tab',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './card-stats-tab.html',
  styleUrl: './card-stats-tab.scss',
})
export class CardStatsTab implements OnChanges {
  @Input({ required: true }) tournamentId!: number;

  private readonly standingsService = inject(StandingsService);

  readonly rows = signal<CardStatsRow[]>([]);
  readonly displayedColumns = ['playerName', 'teamName', 'yellowCards', 'redCards', 'totalCards'];

  ngOnChanges(): void {
    if (this.tournamentId) {
      this.standingsService.getCardStats(this.tournamentId).subscribe((rows) => this.rows.set(rows));
    }
  }
}
