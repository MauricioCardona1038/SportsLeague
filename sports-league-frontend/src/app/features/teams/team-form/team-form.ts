import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './team-form.html',
  styleUrl: './team-form.scss',
})
export class TeamForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly teamService = inject(TeamService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  editing = false;
  private id?: number;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    city: ['', Validators.required],
    stadium: ['', Validators.required],
    logoUrl: [''],
    foundedDate: this.fb.control<Date | null>(null, Validators.required),
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editing = true;
      this.id = Number(idParam);
      this.teamService.getById(this.id).subscribe((team) => {
        this.form.patchValue({
          ...team,
          foundedDate: new Date(team.foundedDate),
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
      foundedDate: raw.foundedDate!.toISOString(),
    };

    if (this.editing) {
      this.teamService.update(this.id!, payload).subscribe(() => this.onSaved(true));
    } else {
      this.teamService.create(payload).subscribe(() => this.onSaved(false));
    }
  }

  private onSaved(wasEditing: boolean): void {
    const message = wasEditing ? 'Equipo actualizado correctamente.' : 'Equipo creado correctamente.';
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/equipos']);
  }
}
