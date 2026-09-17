import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { PLAYER_POSITION_LABELS } from '../../../shared/enums/player-position.enum';
import { PlayerService } from '../player.service';
import { PlayerResponse } from '../player.model';
import { TeamService } from '../../teams/team.service';
import { TeamResponse } from '../../teams/team.model';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss',
})
export class PlayerList implements OnInit {
  readonly players = signal<PlayerResponse[]>([]);
  readonly teams = signal<TeamResponse[]>([]);
  readonly loading = signal(true);
  readonly teamFilter = signal<number | null>(null);
  readonly displayedColumns = ['name', 'number', 'position', 'team', 'actions'];

  readonly filteredPlayers = computed(() => {
    const filter = this.teamFilter();
    const players = this.players();
    return filter === null ? players : players.filter((p) => p.teamId === filter);
  });

  constructor(
    private readonly playerService: PlayerService,
    private readonly teamService: TeamService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.load();
    this.teamService.getAll().subscribe((teams) => this.teams.set(teams));
  }

  load(): void {
    this.loading.set(true);
    this.playerService.getAll().subscribe({
      next: (players) => {
        this.players.set(players);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  positionLabel(player: PlayerResponse): string {
    return PLAYER_POSITION_LABELS[player.position];
  }

  remove(player: PlayerResponse): void {
    this.dialog
      .open(ConfirmDialog, {
        data: {
          title: 'Eliminar jugador',
          message: `¿Está seguro de eliminar a ${player.firstName} ${player.lastName}? Esta acción no se puede deshacer.`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.playerService.delete(player.id).subscribe(() => {
          this.snackBar.open('Jugador eliminado correctamente.', 'Cerrar', { duration: 3000 });
          this.load();
        });
      });
  }
}
