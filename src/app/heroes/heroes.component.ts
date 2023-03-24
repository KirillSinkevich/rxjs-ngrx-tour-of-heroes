import {Component} from '@angular/core';
import {delay, finalize, Observable, share, shareReplay, switchMap, take} from 'rxjs';
import {tap} from 'rxjs/operators';

import {Hero} from '../hero';
import {HeroService} from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent {
  heroes$: Observable<Hero[]> = this.heroService.getHeroes();

  constructor(private heroService: HeroService) { }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroes$ = this.heroService.addHero({ name } as Hero)
      .pipe(
        switchMap(_ => this.heroService.getHeroes()),
      );
  }

  delete(hero: Hero): void {
    this.heroes$ = this.heroService.deleteHero(hero.id)
      .pipe(
        switchMap(_ => this.heroService.getHeroes()),
      );
  }

}
