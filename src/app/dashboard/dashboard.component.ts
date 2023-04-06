import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, iif, Observable, of, scan, startWith } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  searchControl: FormControl = new FormControl<string>('');

  topHeroes$: Observable<Hero[]> = this.heroService.getHeroes().pipe(map(heroes => heroes.slice(1, 5)));

  searchHeroes$: Observable<Hero[]> = this._getSearchHeroes$();

  private _cache: Map<string, Hero[]> = new Map();

  constructor(private heroService: HeroService) {}

  get searchCntrValue(): string {
    return this.searchControl.value;
  }

  private _getSearchHeroes$(): Observable<Hero[]> {
    return combineLatest([this.heroService.getHeroes(), this._searchControlChanges$v2()]).pipe(
      map(([allHeroes, searchHeroes]) => (searchHeroes.length ? searchHeroes : allHeroes))
    );

    // return this._searchControlChanges$v1();
    // return this._searchControlChanges$v2();

    // return merge(this.heroService.getHeroes(), this._searchControlChanges$v2()).pipe(
    //   map((val) => {
    //     console.log(val);
    //     return val;
    //   }),
    // );
  }

  private _searchControlChanges$v1(): Observable<Hero[]> {
    return this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap((searchVal: string) => !searchVal.length && this._cache.clear()),
      switchMap((searchVal: string) =>
        iif(
          () => this._cache.has(searchVal),
          of(this._cache.get(searchVal) || ([] as Hero[])),
          this.heroService.searchHeroes(searchVal).pipe(
            tap((heroes: Hero[]) => this._cache.set(searchVal, heroes)),
            tap(val => console.log(val))
          )
        )
      )
    );
  }

  private _searchControlChanges$v2(): Observable<Hero[]> {
    return this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      scan((acc: string, curr: string) => {
        return !!acc && curr.includes(acc) ? acc : curr;
      }, ''),
      distinctUntilChanged(),
      switchMap((searchVal: string) => this.heroService.searchHeroes(searchVal))
    );
  }
}
