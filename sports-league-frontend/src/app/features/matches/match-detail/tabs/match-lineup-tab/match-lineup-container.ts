import { Component, Input } from '@angular/core';
import { MatchLineupSide } from './match-lineup-tab';

@Component({
  selector: 'app-match-lineup-tab',
  standalone: true,
  imports: [MatchLineupSide],
  templateUrl: './match-lineup-container.html',
  styleUrl: './match-lineup-container.scss',
})
export class MatchLineupTab {
  @Input({ required: true }) matchId!: number;
  @Input({ required: true }) homeTeamId!: number;
  @Input({ required: true }) awayTeamId!: number;
  @Input() homeTeamName = 'Local';
  @Input() awayTeamName = 'Visitante';
}
