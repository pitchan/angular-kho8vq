import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

import { products } from '../products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  products = products;
  footData = null;

  objects = {
    award_winners: 'award_winners',
    awards: 'awards',
    bookings: 'bookings',
    confederations: 'confederations',
    goals: 'goals',
    group_standings: 'group_standings',
    groups: 'groups',
    host_countries: 'host_countries',
    manager_appearances: 'manager_appearances',
    manager_appointments: 'manager_appointments',
    managers: 'managers',
    matches: 'matches',
    penalty_kicks: 'penalty_kicks',
    player_appearances: 'player_appearances',
    players: 'players',
    qualified_teams: 'qualified_teams',
    referee_appearances: 'referee_appearances',
    referee_appointments: 'referee_appointments',
    referees: 'referees',
    squads: 'squads',
    stadiums: 'stadiums',
    substitutions: 'substitutions',
    team_appearances: 'team_appearances',
    teams: 'teams',
    tournament_stages: 'tournament_stages',
    tournament_standings: 'tournament_standings',
    tournaments: 'tournaments',
  };

  constructor(private http: HttpClient) {
    let csv = null;
    this.getWorldCupData().subscribe((data) => {
      //this.getGoalsPerTeams(data);
      const years = this.getYearsTournaments(data);
      csv = 'pays,region,' + years.join(',') + '\n';

      const goalsPerTeams = this.getGoalsPerTeams(data);
      Object.keys(goalsPerTeams).map((team) => {
        const teamName = team;
        const teamRegion = goalsPerTeams[team].region.replace(',', '|');
        const teamGoals = goalsPerTeams[team].goals;
        csv += `${teamName},${teamRegion},${teamGoals.join(',')}\n`;
      });
      console.log(csv);
    });
  }

  getWorldCupData() {
    return this.http
      .get<any>(
        'https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-json/worldcup.json'
      )
      .pipe(
        map((data) => {
          return JSON.parse(data);
        })
      );
  }

  getYearsTournaments(data) {
    const years = [];
    data.tournaments.forEach((tournament) => {
      years.push(tournament.year);
    });
    return years;
  }

  getGoalsPerTeams(data) {
    const result = {};

    data.teams.forEach((team) => {
      result[team.team_name] = {
        region: team.region_name,
        goals: [],
      };
      result[team.team_name]['goals'] = [];
      data.tournaments.forEach((tournament) => {
        const teamGoals = data.goals.filter(
          (goal) =>
            goal.team_id === team.team_id &&
            goal.tournament_id === tournament.tournament_id
        );
        result[team.team_name].goals.push(teamGoals.length);
      });
    });
    return result;
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
