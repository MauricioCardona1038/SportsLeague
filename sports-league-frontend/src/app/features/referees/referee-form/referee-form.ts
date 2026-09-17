import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RefereeService } from '../referee.service';

@Component({
  selector: 'app-referee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './referee-form.html',
  styleUrl: './referee-form.scss',
})
export class RefereeForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly refereeService = inject(RefereeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  editing = false;
  private id?: number;

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    nationality: ['', Validators.required],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editing = true;
      this.id = Number(idParam);
      this.refereeService.getById(this.id).subscribe((referee) => {
        this.form.patchValue(referee);
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    if (this.editing) {
      this.refereeService.update(this.id!, payload).subscribe(() => this.onSaved(true));
    } else {
      this.refereeService.create(payload).subscribe(() => this.onSaved(false));
    }
  }

  private onSaved(wasEditing: boolean): void {
    const message = wasEditing ? 'Árbitro actualizado correctamente.' : 'Árbitro creado correctamente.';
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/arbitros']);
  }
}
