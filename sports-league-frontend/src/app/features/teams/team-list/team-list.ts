import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { TeamService } from '../team.service';
import { TeamResponse } from '../team.model';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [RouterLink, DatePipe, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './team-list.html',
  styleUrl: './team-list.scss',
})
export class TeamList implements OnInit {
  readonly teams = signal<TeamResponse[]>([]);
  readonly loading = signal(true);
  readonly displayedColumns = ['name', 'city', 'stadium', 'foundedDate', 'actions'];

  constructor(
    private readonly teamService: TeamService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.teamService.getAll().subscribe({
      next: (teams) => {
        this.teams.set(teams);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  remove(team: TeamResponse): void {
    this.dialog
      .open(ConfirmDialog, {
        data: {
          title: 'Eliminar equipo',
          message: `¿Está seguro de eliminar el equipo ${team.name}? Esta acción no se puede deshacer.`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.teamService.delete(team.id).subscribe(() => {
          this.snackBar.open('Equipo eliminado correctamente.', 'Cerrar', { duration: 3000 });
          this.load();
        });
      });
  }
}
