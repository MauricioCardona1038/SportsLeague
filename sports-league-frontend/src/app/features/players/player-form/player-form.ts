import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlayerService } from '../player.service';
import { TeamService } from '../../teams/team.service';
import { TeamResponse } from '../../teams/team.model';
import { PlayerPosition, PLAYER_POSITION_LABELS } from '../../../shared/enums/player-position.enum';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './player-form.html',
  styleUrl: './player-form.scss',
})
export class PlayerForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly playerService = inject(PlayerService);
  private readonly teamService = inject(TeamService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  editing = false;
  private id?: number;

  readonly teams = signal<TeamResponse[]>([]);

  readonly positionOptions: { value: PlayerPosition; label: string }[] = [
    { value: PlayerPosition.Goalkeeper, label: PLAYER_POSITION_LABELS[PlayerPosition.Goalkeeper] },
    { value: PlayerPosition.Defender, label: PLAYER_POSITION_LABELS[PlayerPosition.Defender] },
    { value: PlayerPosition.Midfielder, label: PLAYER_POSITION_LABELS[PlayerPosition.Midfielder] },
    { value: PlayerPosition.Forward, label: PLAYER_POSITION_LABELS[PlayerPosition.Forward] },
  ];

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthDate: this.fb.control<Date | null>(null, Validators.required),
    number: [1, [Validators.required, Validators.min(1)]],
    position: [PlayerPosition.Goalkeeper, Validators.required],
    teamId: this.fb.control<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.teamService.getAll().subscribe((teams) => this.teams.set(teams));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editing = true;
      this.id = Number(idParam);
      this.playerService.getById(this.id).subscribe((player) => {
        this.form.patchValue({
          ...player,
          birthDate: new Date(player.birthDate),
        });
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      birthDate: raw.birthDate!.toISOString(),
      teamId: raw.teamId!,
    };

    if (this.editing) {
      this.playerService.update(this.id!, payload).subscribe(() => this.onSaved(true));
    } else {
      this.playerService.create(payload).subscribe(() => this.onSaved(false));
    }
  }

  private onSaved(wasEditing: boolean): void {
    const message = wasEditing ? 'Jugador actualizado correctamente.' : 'Jugador creado correctamente.';
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/jugadores']);
  }
}
