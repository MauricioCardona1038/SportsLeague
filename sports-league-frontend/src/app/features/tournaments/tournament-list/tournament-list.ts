import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { TOURNAMENT_STATUS_LABELS, TournamentStatus } from '../../../shared/enums/tournament-status.enum';
import { TournamentService } from '../tournament.service';
import { TournamentResponse } from '../tournament.model';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
  ],
  templateUrl: './tournament-list.html',
  styleUrl: './tournament-list.scss',
})
export class TournamentList implements OnInit {
  readonly tournaments = signal<TournamentResponse[]>([]);
  readonly loading = signal(true);
  readonly displayedColumns = ['name', 'season', 'dates', 'status', 'teamsCount', 'actions'];
  readonly statusOptions = [
    TournamentStatus.Pending,
    TournamentStatus.InProgress,
    TournamentStatus.Finished,
  ];

  constructor(
    private readonly tournamentService: TournamentService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.tournamentService.getAll().subscribe({
      next: (tournaments) => {
        this.tournaments.set(tournaments);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  statusLabel(tournament: TournamentResponse): string {
    return TOURNAMENT_STATUS_LABELS[tournament.status];
  }

  statusOptionLabel(status: TournamentStatus): string {
    return TOURNAMENT_STATUS_LABELS[status];
  }

  changeStatus(tournament: TournamentResponse, status: TournamentStatus): void {
    this.tournamentService.updateStatus(tournament.id, status).subscribe(() => {
      this.snackBar.open('Estado actualizado correctamente.', 'Cerrar', { duration: 3000 });
      this.load();
    });
  }

  remove(tournament: TournamentResponse): void {
    this.dialog
      .open(ConfirmDialog, {
        data: {
          title: 'Eliminar torneo',
          message: `¿Está seguro de eliminar el torneo ${tournament.name}? Esta acción no se puede deshacer.`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.tournamentService.delete(tournament.id).subscribe(() => {
          this.snackBar.open('Torneo eliminado correctamente.', 'Cerrar', { duration: 3000 });
          this.load();
        });
      });
  }
}
