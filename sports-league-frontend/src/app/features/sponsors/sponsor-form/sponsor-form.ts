import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SponsorService } from '../sponsor.service';
import { SponsorCategory, SPONSOR_CATEGORY_LABELS } from '../../../shared/enums/sponsor-category.enum';

@Component({
  selector: 'app-sponsor-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './sponsor-form.html',
  styleUrl: './sponsor-form.scss',
})
export class SponsorForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly sponsorService = inject(SponsorService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  editing = false;
  private id?: number;

  readonly categoryOptions: { value: SponsorCategory; label: string }[] = [
    { value: SponsorCategory.Main, label: SPONSOR_CATEGORY_LABELS.Main },
    { value: SponsorCategory.Gold, label: SPONSOR_CATEGORY_LABELS.Gold },
    { value: SponsorCategory.Silver, label: SPONSOR_CATEGORY_LABELS.Silver },
    { value: SponsorCategory.Bronze, label: SPONSOR_CATEGORY_LABELS.Bronze },
  ];

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    contactEmail: ['', [Validators.required, Validators.email]],
    phone: [''],
    websiteUrl: [''],
    category: [SponsorCategory.Main, Validators.required],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editing = true;
      this.id = Number(idParam);
      this.sponsorService.getById(this.id).subscribe((sponsor) => {
        this.form.patchValue({
          ...sponsor,
          category: SponsorCategory[sponsor.category],
        });
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
      this.sponsorService.update(this.id!, payload).subscribe(() => this.onSaved(true));
    } else {
      this.sponsorService.create(payload).subscribe(() => this.onSaved(false));
    }
  }

  private onSaved(wasEditing: boolean): void {
    const message = wasEditing
      ? 'Patrocinador actualizado correctamente.'
      : 'Patrocinador creado correctamente.';
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/patrocinadores']);
  }
}
