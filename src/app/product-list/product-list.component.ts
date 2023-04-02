import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

import { products } from '../products';

import * as i18nIsoCountries from 'i18n-iso-countries';

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
    i18nIsoCountries.registerLocale(
      require('i18n-iso-countries/langs/en.json')
    );
    console.log();
    let csv = null;
    this.getWorldCupData().subscribe((data) => {
      //this.getGoalsPerTeams(data);
      const years = this.getYearsTournaments(data);
      csv = 'pays,region,flag,' + years.join(',') + '\n';

      const goalsPerTeams = this.getGoalsPerTeams(data);
      Object.keys(goalsPerTeams).map((team) => {
        const teamName = team;
        const teamFlag = this.getTeamFlagUrl(team);
        const teamRegion = goalsPerTeams[team].region.replace(',', '|');
        const teamGoals = goalsPerTeams[team].goals;
        csv += `${teamName},${teamRegion},${teamFlag},${teamGoals.join(',')}\n`;
      });
      this.downloadCSV(csv, 'GoalsPerTeamsWorldCup');
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

  getTeamFlagUrl(teamName) {
    const countryCode = i18nIsoCountries.getAlpha2Code(teamName, 'en');
    // return `https://public.flourish.studio/country-flags/svg/${countryCode}.svg`;
    return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`;
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
    let oldScore = 0;
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
        oldScore = 0;
        if (result[team.team_name].goals.length > 0) {
          oldScore =
            result[team.team_name].goals[
              result[team.team_name].goals.length - 1
            ];
        }
        result[team.team_name].goals.push(oldScore + teamGoals.length);
      });
    });
    return result;
  }

  downloadCSV(csv: string, name: string): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
