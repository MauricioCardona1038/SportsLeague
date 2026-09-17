import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { MATCH_STATUS_LABELS } from '../../../shared/enums/match-status.enum';
import { MatchService } from '../match.service';
import { MatchResponse } from '../match.model';
import { TournamentService } from '../../tournaments/tournament.service';
import { TournamentResponse } from '../../tournaments/tournament.model';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './match-list.html',
  styleUrl: './match-list.scss',
})
export class MatchList implements OnInit {
  readonly tournaments = signal<TournamentResponse[]>([]);
  readonly selectedTournamentId = signal<number | null>(null);
  readonly matches = signal<MatchResponse[]>([]);
  readonly loading = signal(false);
  readonly displayedColumns = ['matchDate', 'homeTeamName', 'awayTeamName', 'matchday', 'status', 'actions'];

  constructor(
    private readonly matchService: MatchService,
    private readonly tournamentService: TournamentService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.tournamentService.getAll().subscribe((tournaments) => this.tournaments.set(tournaments));
  }

  onTournamentChange(tournamentId: number): void {
    this.selectedTournamentId.set(tournamentId);
    this.loading.set(true);
    this.matchService.getByTournament(tournamentId).subscribe({
      next: (matches) => {
        this.matches.set(matches);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  statusLabel(match: MatchResponse): string {
    return MATCH_STATUS_LABELS[match.status];
  }

  openDetail(match: MatchResponse): void {
    this.router.navigate(['/partidos', match.id]);
  }

  remove(match: MatchResponse, event: Event): void {
    event.stopPropagation();
    this.dialog
      .open(ConfirmDialog, {
        data: {
          title: 'Eliminar partido',
          message: `¿Está seguro de eliminar el partido ${match.homeTeamName} vs ${match.awayTeamName}? Esta acción no se puede deshacer.`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.matchService.delete(match.id).subscribe(() => {
          this.snackBar.open('Partido eliminado correctamente.', 'Cerrar', { duration: 3000 });
          this.onTournamentChange(match.tournamentId);
        });
      });
  }
}
