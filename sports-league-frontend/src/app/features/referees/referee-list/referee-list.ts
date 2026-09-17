import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { RefereeService } from '../referee.service';
import { RefereeResponse } from '../referee.model';

@Component({
  selector: 'app-referee-list',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './referee-list.html',
  styleUrl: './referee-list.scss',
})
export class RefereeList implements OnInit {
  readonly referees = signal<RefereeResponse[]>([]);
  readonly loading = signal(true);
  readonly displayedColumns = ['firstName', 'lastName', 'nationality', 'actions'];

  constructor(
    private readonly refereeService: RefereeService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.refereeService.getAll().subscribe({
      next: (referees) => {
        this.referees.set(referees);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  remove(referee: RefereeResponse): void {
    this.dialog
      .open(ConfirmDialog, {
        data: {
          title: 'Eliminar árbitro',
          message: `¿Está seguro de eliminar a ${referee.firstName} ${referee.lastName}? Esta acción no se puede deshacer.`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.refereeService.delete(referee.id).subscribe(() => {
          this.snackBar.open('Árbitro eliminado correctamente.', 'Cerrar', { duration: 3000 });
          this.load();
        });
      });
  }
}
