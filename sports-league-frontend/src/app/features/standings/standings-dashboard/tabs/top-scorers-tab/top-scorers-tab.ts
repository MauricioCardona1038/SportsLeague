import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { StandingsService } from '../../../standings.service';
import { TopScorerRow } from '../../../standings.model';

@Component({
  selector: 'app-top-scorers-tab',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './top-scorers-tab.html',
  styleUrl: './top-scorers-tab.scss',
})
export class TopScorersTab implements OnChanges {
  @Input({ required: true }) tournamentId!: number;

  private readonly standingsService = inject(StandingsService);

  readonly rows = signal<TopScorerRow[]>([]);
  readonly displayedColumns = ['playerName', 'teamName', 'goals', 'penalties', 'matchesWithGoals'];

  ngOnChanges(): void {
    if (this.tournamentId) {
      this.standingsService.getTopScorers(this.tournamentId).subscribe((rows) => this.rows.set(rows));
    }
  }
}
