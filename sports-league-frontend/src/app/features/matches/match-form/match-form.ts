import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatchService } from '../match.service';
import { TournamentService } from '../../tournaments/tournament.service';
import { TournamentResponse } from '../../tournaments/tournament.model';
import { TeamService } from '../../teams/team.service';
import { TeamResponse } from '../../teams/team.model';
import { RefereeService } from '../../referees/referee.service';
import { RefereeResponse } from '../../referees/referee.model';

function differentTeamsValidator(group: AbstractControl): ValidationErrors | null {
  const home = group.get('homeTeamId')?.value;
  const away = group.get('awayTeamId')?.value;
  if (home !== null && away !== null && home === away) {
    return { sameTeam: true };
  }
  return null;
}

@Component({
  selector: 'app-match-form',
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
  templateUrl: './match-form.html',
  styleUrl: './match-form.scss',
})
export class MatchForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly matchService = inject(MatchService);
  private readonly tournamentService = inject(TournamentService);
  private readonly teamService = inject(TeamService);
  private readonly refereeService = inject(RefereeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  editing = false;
  private id?: number;

  readonly tournaments = signal<TournamentResponse[]>([]);
  readonly teams = signal<TeamResponse[]>([]);
  readonly referees = signal<RefereeResponse[]>([]);

  readonly form = this.fb.nonNullable.group(
    {
      tournamentId: this.fb.control<number | null>(null, Validators.required),
      homeTeamId: this.fb.control<number | null>(null, Validators.required),
      awayTeamId: this.fb.control<number | null>(null, Validators.required),
      refereeId: this.fb.control<number | null>(null, Validators.required),
      matchDate: this.fb.control<Date | null>(null, Validators.required),
      matchTime: ['20:00', Validators.required],
      venue: ['', Validators.required],
      matchday: [1, [Validators.required, Validators.min(1)]],
    },
    { validators: differentTeamsValidator },
  );

  ngOnInit(): void {
    this.tournamentService.getAll().subscribe((tournaments) => this.tournaments.set(tournaments));
    this.teamService.getAll().subscribe((teams) => this.teams.set(teams));
    this.refereeService.getAll().subscribe((referees) => this.referees.set(referees));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editing = true;
      this.id = Number(idParam);
      this.matchService.getById(this.id).subscribe((match) => {
        const matchDate = new Date(match.matchDate);
        const hh = String(matchDate.getHours()).padStart(2, '0');
        const mm = String(matchDate.getMinutes()).padStart(2, '0');
        this.form.patchValue({
          ...match,
          matchDate,
          matchTime: `${hh}:${mm}`,
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
    const combinedDate = new Date(raw.matchDate!);
    const [hours, minutes] = raw.matchTime.split(':').map(Number);
    combinedDate.setHours(hours, minutes, 0, 0);

    const payload = {
      tournamentId: raw.tournamentId!,
      homeTeamId: raw.homeTeamId!,
      awayTeamId: raw.awayTeamId!,
      refereeId: raw.refereeId!,
      matchDate: combinedDate.toISOString(),
      venue: raw.venue,
      matchday: raw.matchday,
    };

    if (this.editing) {
      this.matchService.update(this.id!, payload).subscribe(() => this.onSaved(true));
    } else {
      this.matchService.create(payload).subscribe(() => this.onSaved(false));
    }
  }

  private onSaved(wasEditing: boolean): void {
    const message = wasEditing ? 'Partido actualizado correctamente.' : 'Partido creado correctamente.';
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/partidos']);
  }
}
