import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent {
  searchString: string = '';
  topHeroes$: Observable<Hero[]> = this.heroService.getHeroes()
    .pipe(map(heroes => heroes.slice(1, 5)));

  searchHeroes$: Observable<Hero[]> = this.heroService.searchHeroes(this.searchString);

  constructor(private heroService: HeroService) {}

  searchHero(val: string): void {
    this.searchHeroes$ = this.heroService.searchHeroes(val)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
  }
}
