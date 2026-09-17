import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { StandingsService } from '../../../standings.service';
import { StandingRow } from '../../../standings.model';

@Component({
  selector: 'app-standings-table-tab',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './standings-table-tab.html',
  styleUrl: './standings-table-tab.scss',
})
export class StandingsTableTab implements OnChanges {
  @Input({ required: true }) tournamentId!: number;

  private readonly standingsService = inject(StandingsService);

  readonly rows = signal<StandingRow[]>([]);
  readonly displayedColumns = [
    'position',
    'teamName',
    'matchesPlayed',
    'wins',
    'draws',
    'losses',
    'goalsFor',
    'goalsAgainst',
    'goalDifference',
    'points',
  ];

  ngOnChanges(): void {
    if (this.tournamentId) {
      this.standingsService.getStandings(this.tournamentId).subscribe((rows) => this.rows.set(rows));
    }
  }
}
