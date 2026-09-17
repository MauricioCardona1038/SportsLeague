import { Component, Input, OnChanges, computed, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TournamentService } from '../../../tournament.service';
import { TeamService } from '../../../../teams/team.service';
import { TeamResponse } from '../../../../teams/team.model';

@Component({
  selector: 'app-tournament-teams-tab',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './tournament-teams-tab.html',
  styleUrl: './tournament-teams-tab.scss',
})
export class TournamentTeamsTab implements OnChanges {
  @Input({ required: true }) tournamentId!: number;

  readonly registeredTeams = signal<TeamResponse[]>([]);
  readonly allTeams = signal<TeamResponse[]>([]);
  readonly selectedTeamId = signal<number | null>(null);
  readonly displayedColumns = ['name', 'city', 'stadium'];

  readonly availableTeams = computed(() => {
    const registeredIds = new Set(this.registeredTeams().map((t) => t.id));
    return this.allTeams().filter((t) => !registeredIds.has(t.id));
  });

  constructor(
    private readonly tournamentService: TournamentService,
    private readonly teamService: TeamService,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnChanges(): void {
    if (this.tournamentId) {
      this.loadRegisteredTeams();
      this.teamService.getAll().subscribe((teams) => this.allTeams.set(teams));
    }
  }

  loadRegisteredTeams(): void {
    this.tournamentService.getTeams(this.tournamentId).subscribe((teams) => {
      this.registeredTeams.set(teams);
    });
  }

  registerSelectedTeam(): void {
    const teamId = this.selectedTeamId();
    if (teamId === null) return;

    this.tournamentService.registerTeam(this.tournamentId, teamId).subscribe(() => {
      this.snackBar.open('Equipo inscrito correctamente.', 'Cerrar', { duration: 3000 });
      this.selectedTeamId.set(null);
      this.loadRegisteredTeams();
    });
  }
}
