import { Component } from '@angular/core';
import { Observable, Subject, switchMap, filter, startWith, merge } from 'rxjs';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent {
  private _add$: Subject<string> = new Subject<string>();
  private _delete$: Subject<number> = new Subject<number>();

  heroes$: Observable<Hero[]> = merge(
    this._add$.pipe(
      filter(Boolean),
      switchMap((name: string) => this.heroService.addHero({ name } as Hero)),
    ),
    this._delete$.pipe(
      filter(Boolean),
      switchMap((heroId: number) => this.heroService.deleteHero(heroId)),
    ),
  ).pipe(
    startWith(''),
    switchMap(() => this.heroService.getHeroes()),
  );

  constructor(private heroService: HeroService) {}

  add(name: string): void {
    this._add$.next(name);
  }

  delete(hero: Hero): void {
    this._delete$.next(hero.id);
  }
}
