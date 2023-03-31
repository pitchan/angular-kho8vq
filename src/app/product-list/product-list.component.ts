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
    this.getTournaments().subscribe();
  }

  getTournaments() {
    return this.http
      .get<any>(
        'https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-json/worldcup.json'
      )
      .pipe(
        map((data) => {
          this.footData = JSON.parse(data);
          console.log(this.footData.awards);
          return 'map';
          /*return data.cups.map((cup) => {
            console.log(`${cup.host} ${cup.year}`);
            return `${cup.host} ${cup.year}`;
          });*/
        })
      );
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
