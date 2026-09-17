import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatchLineupService } from '../../../match-lineup.service';
import { MatchLineupResponse } from '../../../match-lineup.model';
import { PlayerService } from '../../../../players/player.service';
import { PlayerResponse } from '../../../../players/player.model';

@Component({
  selector: 'app-match-lineup-side',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './match-lineup-side.html',
  styleUrl: './match-lineup-tab.scss',
})
export class MatchLineupSide implements OnChanges {
  @Input({ required: true }) matchId!: number;
  @Input({ required: true }) teamId!: number;
  @Input() label = '';

  private readonly fb = inject(FormBuilder);
  private readonly matchLineupService = inject(MatchLineupService);
  private readonly playerService = inject(PlayerService);
  private readonly snackBar = inject(MatSnackBar);

  readonly lineup = signal<MatchLineupResponse[]>([]);
  readonly players = signal<PlayerResponse[]>([]);
  readonly displayedColumns = ['playerName', 'isStarter', 'position', 'actions'];

  readonly form = this.fb.nonNullable.group({
    playerId: this.fb.control<number | null>(null, Validators.required),
    isStarter: [true],
    position: ['', Validators.required],
  });

  ngOnChanges(): void {
    if (this.matchId && this.teamId) {
      this.loadLineup();
      this.playerService.getByTeam(this.teamId).subscribe((players) => this.players.set(players));
    }
  }

  private loadLineup(): void {
    this.matchLineupService.getLineupByTeam(this.matchId, this.teamId).subscribe((lineup) => {
      this.lineup.set(lineup);
    });
  }

  addEntry(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    this.matchLineupService
      .addLineupEntry(this.matchId, { playerId: payload.playerId!, isStarter: payload.isStarter, position: payload.position })
      .subscribe(() => {
        this.snackBar.open('Jugador agregado a la alineación.', 'Cerrar', { duration: 3000 });
        this.form.reset({ playerId: null, isStarter: true, position: '' });
        this.loadLineup();
      });
  }

  remove(entry: MatchLineupResponse): void {
    this.matchLineupService.deleteLineupEntry(this.matchId, entry.id).subscribe(() => {
      this.snackBar.open('Jugador eliminado de la alineación.', 'Cerrar', { duration: 3000 });
      this.loadLineup();
    });
  }
}
