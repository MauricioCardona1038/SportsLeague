import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { SPONSOR_CATEGORY_LABELS } from '../../../shared/enums/sponsor-category.enum';
import { SponsorService } from '../sponsor.service';
import { SponsorResponse } from '../sponsor.model';

@Component({
  selector: 'app-sponsor-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './sponsor-list.html',
  styleUrl: './sponsor-list.scss',
})
export class SponsorList implements OnInit {
  readonly sponsors = signal<SponsorResponse[]>([]);
  readonly loading = signal(true);
  readonly displayedColumns = ['name', 'category', 'contactEmail', 'phone', 'actions'];

  categoryLabel(sponsor: SponsorResponse): string {
    return SPONSOR_CATEGORY_LABELS[sponsor.category];
  }

  constructor(
    private readonly sponsorService: SponsorService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.sponsorService.getAll().subscribe({
      next: (sponsors) => {
        this.sponsors.set(sponsors);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  remove(sponsor: SponsorResponse): void {
    this.dialog
      .open(ConfirmDialog, {
        data: {
          title: 'Eliminar patrocinador',
          message: `¿Está seguro de eliminar a ${sponsor.name}? Esta acción no se puede deshacer.`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.sponsorService.delete(sponsor.id).subscribe(() => {
          this.snackBar.open('Patrocinador eliminado correctamente.', 'Cerrar', { duration: 3000 });
          this.load();
        });
      });
  }
}
