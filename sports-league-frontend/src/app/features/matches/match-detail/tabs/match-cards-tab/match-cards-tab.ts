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
import { CardResponse } from '../../../match-event.model';
import { PlayerService } from '../../../../players/player.service';
import { PlayerResponse } from '../../../../players/player.model';
import { CardType, CARD_TYPE_LABELS } from '../../../../../shared/enums/card-type.enum';

@Component({
  selector: 'app-match-cards-tab',
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
  templateUrl: './match-cards-tab.html',
  styleUrl: './match-cards-tab.scss',
})
export class MatchCardsTab implements OnChanges {
  @Input({ required: true }) matchId!: number;
  @Input({ required: true }) homeTeamId!: number;
  @Input({ required: true }) awayTeamId!: number;

  private readonly fb = inject(FormBuilder);
  private readonly matchEventService = inject(MatchEventService);
  private readonly playerService = inject(PlayerService);
  private readonly snackBar = inject(MatSnackBar);

  readonly cards = signal<CardResponse[]>([]);
  readonly players = signal<(PlayerResponse & { teamLabel: string })[]>([]);
  readonly displayedColumns = ['playerName', 'minute', 'type', 'actions'];

  readonly typeOptions: { value: CardType; label: string }[] = [
    { value: CardType.Yellow, label: CARD_TYPE_LABELS[CardType.Yellow] },
    { value: CardType.Red, label: CARD_TYPE_LABELS[CardType.Red] },
  ];

  readonly form = this.fb.nonNullable.group({
    playerId: this.fb.control<number | null>(null, Validators.required),
    minute: [1, [Validators.required, Validators.min(1)]],
    type: [CardType.Yellow, Validators.required],
  });

  ngOnChanges(): void {
    if (this.matchId) {
      this.loadCards();
    }
    if (this.homeTeamId && this.awayTeamId) {
      this.loadPlayers();
    }
  }

  private loadCards(): void {
    this.matchEventService.getCards(this.matchId).subscribe((cards) => this.cards.set(cards));
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

  typeLabel(card: CardResponse): string {
    return CARD_TYPE_LABELS[card.type];
  }

  addCard(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    this.matchEventService
      .addCard(this.matchId, { playerId: payload.playerId!, minute: payload.minute, type: payload.type })
      .subscribe(() => {
        this.snackBar.open('Tarjeta agregada correctamente.', 'Cerrar', { duration: 3000 });
        this.form.reset({ playerId: null, minute: 1, type: CardType.Yellow });
        this.loadCards();
      });
  }

  remove(card: CardResponse): void {
    this.matchEventService.deleteCard(this.matchId, card.id).subscribe(() => {
      this.snackBar.open('Tarjeta eliminada correctamente.', 'Cerrar', { duration: 3000 });
      this.loadCards();
    });
  }
}
