import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatchEventService } from '../../../match-event.service';
import { GoalResponse } from '../../../match-event.model';
import { PlayerService } from '../../../../players/player.service';
import { PlayerResponse } from '../../../../players/player.model';
import { GoalType, GOAL_TYPE_LABELS } from '../../../../../shared/enums/goal-type.enum';

@Component({
  selector: 'app-match-goals-tab',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './match-goals-tab.html',
  styleUrl: './match-goals-tab.scss',
})
export class MatchGoalsTab implements OnChanges {
  @Input({ required: true }) matchId!: number;
  @Input({ required: true }) homeTeamId!: number;
  @Input({ required: true }) awayTeamId!: number;

  private readonly fb = inject(FormBuilder);
  private readonly matchEventService = inject(MatchEventService);
  private readonly playerService = inject(PlayerService);
  private readonly snackBar = inject(MatSnackBar);

  readonly goals = signal<GoalResponse[]>([]);
  readonly players = signal<(PlayerResponse & { teamLabel: string })[]>([]);
  readonly displayedColumns = ['playerName', 'minute', 'type', 'actions'];

  readonly typeOptions: { value: GoalType; label: string }[] = [
    { value: GoalType.Normal, label: GOAL_TYPE_LABELS[GoalType.Normal] },
    { value: GoalType.Penalty, label: GOAL_TYPE_LABELS[GoalType.Penalty] },
    { value: GoalType.OwnGoal, label: GOAL_TYPE_LABELS[GoalType.OwnGoal] },
  ];

  readonly form = this.fb.nonNullable.group({
    playerId: this.fb.control<number | null>(null, Validators.required),
    minute: [1, [Validators.required, Validators.min(1)]],
    type: [GoalType.Normal, Validators.required],
  });

  ngOnChanges(): void {
    if (this.matchId) {
      this.loadGoals();
    }
    if (this.homeTeamId && this.awayTeamId) {
      this.loadPlayers();
    }
  }

  private loadGoals(): void {
    this.matchEventService.getGoals(this.matchId).subscribe((goals) => this.goals.set(goals));
  }

  private loadPlayers(): void {
    forkJoin([
      this.playerService.getByTeam(this.homeTeamId),
      this.playerService.getByTeam(this.awayTeamId),
    ]).subscribe(([homePlayers, awayPlayers]) => {
      const home = homePlayers.map((p) => ({ ...p, teamLabel: p.teamName }));
      const away = awayPlayers.map((p) => ({ ...p, teamLabel: p.teamName }));
      this.players.set([...home, ...away]);
    });
  }

  typeLabel(goal: GoalResponse): string {
    return GOAL_TYPE_LABELS[goal.type];
  }

  addGoal(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    this.matchEventService
      .addGoal(this.matchId, { playerId: payload.playerId!, minute: payload.minute, type: payload.type })
      .subscribe(() => {
        this.snackBar.open('Gol agregado correctamente.', 'Cerrar', { duration: 3000 });
        this.form.reset({ playerId: null, minute: 1, type: GoalType.Normal });
        this.loadGoals();
      });
  }

  remove(goal: GoalResponse): void {
    this.matchEventService.deleteGoal(this.matchId, goal.id).subscribe(() => {
      this.snackBar.open('Gol eliminado correctamente.', 'Cerrar', { duration: 3000 });
      this.loadGoals();
    });
  }
}
