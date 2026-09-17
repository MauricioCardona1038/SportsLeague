import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatchEventService } from '../../../match-event.service';
import { MatchResultResponse } from '../../../match-event.model';
import { MatchService } from '../../../match.service';
import { MatchStatus } from '../../../../../shared/enums/match-status.enum';

@Component({
  selector: 'app-match-result-tab',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './match-result-tab.html',
  styleUrl: './match-result-tab.scss',
})
export class MatchResultTab implements OnChanges {
  @Input({ required: true }) matchId!: number;

  private readonly fb = inject(FormBuilder);
  private readonly matchEventService = inject(MatchEventService);
  private readonly matchService = inject(MatchService);
  private readonly snackBar = inject(MatSnackBar);

  readonly result = signal<MatchResultResponse | null>(null);
  readonly loaded = signal(false);

  readonly form = this.fb.nonNullable.group({
    homeGoals: [0, [Validators.required, Validators.min(0)]],
    awayGoals: [0, [Validators.required, Validators.min(0)]],
    observations: [''],
  });

  ngOnChanges(): void {
    if (this.matchId) {
      this.loadResult();
    }
  }

  private loadResult(): void {
    this.loaded.set(false);
    this.matchEventService.getResult(this.matchId).subscribe({
      next: (result) => {
        this.result.set(result);
        this.loaded.set(true);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.result.set(null);
        }
        this.loaded.set(true);
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.matchEventService.saveResult(this.matchId, this.form.getRawValue()).subscribe((result) => {
      this.result.set(result);
      this.snackBar.open('Resultado guardado correctamente.', 'Cerrar', { duration: 3000 });
    });
  }

  markFinished(): void {
    this.matchService.updateStatus(this.matchId, MatchStatus.Finished).subscribe(() => {
      this.snackBar.open('Partido marcado como finalizado.', 'Cerrar', { duration: 3000 });
    });
  }
}
