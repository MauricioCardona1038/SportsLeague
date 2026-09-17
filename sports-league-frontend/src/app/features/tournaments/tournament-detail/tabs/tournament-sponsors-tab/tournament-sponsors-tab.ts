import { Component, Input, OnChanges, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TournamentSponsorService } from '../../../tournament-sponsor.service';
import { TournamentSponsorResponse } from '../../../tournament-sponsor.model';
import { SponsorService } from '../../../../sponsors/sponsor.service';
import { SponsorResponse } from '../../../../sponsors/sponsor.model';
import { SPONSOR_CATEGORY_LABELS, SponsorCategoryName } from '../../../../../shared/enums/sponsor-category.enum';

@Component({
  selector: 'app-tournament-sponsors-tab',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './tournament-sponsors-tab.html',
  styleUrl: './tournament-sponsors-tab.scss',
})
export class TournamentSponsorsTab implements OnChanges {
  @Input({ required: true }) tournamentId!: number;

  readonly linkedSponsors = signal<TournamentSponsorResponse[]>([]);
  readonly allSponsors = signal<SponsorResponse[]>([]);
  readonly selectedSponsorId = signal<number | null>(null);
  readonly contractAmount = signal<number | null>(null);
  readonly displayedColumns = ['sponsorName', 'sponsorCategory', 'contractAmount', 'joinedAt', 'actions'];

  constructor(
    private readonly tournamentSponsorService: TournamentSponsorService,
    private readonly sponsorService: SponsorService,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnChanges(): void {
    if (this.tournamentId) {
      this.loadLinkedSponsors();
      this.sponsorService.getAll().subscribe((sponsors) => this.allSponsors.set(sponsors));
    }
  }

  loadLinkedSponsors(): void {
    this.tournamentSponsorService.getByTournament(this.tournamentId).subscribe((sponsors) => {
      this.linkedSponsors.set(sponsors);
    });
  }

  categoryLabel(sponsorCategory: string): string {
    return SPONSOR_CATEGORY_LABELS[sponsorCategory as SponsorCategoryName];
  }

  linkSelectedSponsor(): void {
    const sponsorId = this.selectedSponsorId();
    const amount = this.contractAmount();
    if (sponsorId === null || amount === null) return;

    this.tournamentSponsorService
      .linkSponsorToTournament(sponsorId, { tournamentId: this.tournamentId, contractAmount: amount })
      .subscribe(() => {
        this.snackBar.open('Patrocinador vinculado correctamente.', 'Cerrar', { duration: 3000 });
        this.selectedSponsorId.set(null);
        this.contractAmount.set(null);
        this.loadLinkedSponsors();
      });
  }

  unlink(sponsorship: TournamentSponsorResponse): void {
    this.tournamentSponsorService.unlink(this.tournamentId, sponsorship.sponsorId).subscribe(() => {
      this.snackBar.open('Patrocinador desvinculado correctamente.', 'Cerrar', { duration: 3000 });
      this.loadLinkedSponsors();
    });
  }
}
