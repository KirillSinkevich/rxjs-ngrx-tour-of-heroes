import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, startWith } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  searchControl: FormControl = new FormControl<string>('');

  topHeroes$: Observable<Hero[]> = this.heroService.getHeroes().pipe(map((heroes) => heroes.slice(1, 5)));

  searchHeroes$: Observable<Hero[]> = this._getSearchHeroes$();

  constructor(private heroService: HeroService) {}

  private _getSearchHeroes$(): Observable<Hero[]> {
    return combineLatest([this.heroService.getHeroes(), this._searchControlChanges$()]).pipe(
      map(([allHeroes, searchHeroes]) => (searchHeroes.length ? searchHeroes : allHeroes)),
    );
  }

  private _searchControlChanges$(): Observable<Hero[]> {
    return this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((string) => this.heroService.searchHeroes(string)),
    );
  }
}
