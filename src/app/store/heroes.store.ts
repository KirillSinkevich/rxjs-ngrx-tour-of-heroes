import { Injectable } from '@angular/core';
import { ComponentStore, OnStateInit, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { EMPTY, filter, finalize, Observable, pipe, scan } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

export interface IHeroesState {
  heroes: Hero[];
  searchHeroes: Hero[];
  topHeroes: Hero[];
  loading: boolean;
}

const defaultState: IHeroesState = {
  heroes: [],
  searchHeroes: [],
  topHeroes: [],
  loading: false,
};

@Injectable()
export class HeroesStore extends ComponentStore<IHeroesState> implements OnStateInit, OnStoreInit {
  private readonly heroes$ = this.select(({ heroes }) => heroes);
  private readonly searchHeroes$ = this.select(({ searchHeroes }) => searchHeroes);
  private readonly topHeroes$ = this.select(({ topHeroes }) => topHeroes);
  private readonly loading$ = this.select(({ loading }) => loading);

  readonly vm$ = this.select(
    {
      heroes: this.heroes$,
      searchHeroes: this.searchHeroes$,
      topHeroes: this.heroes$.pipe(map((heroes: Hero[]) => heroes.slice(1, 5))),
      loading: this.loading$,
    },
    {
      debounce: true,
    }
  );

  constructor(private _heroService: HeroService) {
    super(defaultState);
  }

  updateStore<T extends keyof IHeroesState>(val: IHeroesState[T], field: T): void {
    this.patchState({ [field]: val });
  }

  // EFFECTS
  readonly fetchHeroes = this.effect<void>(
    pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap(() =>
        this._heroService.getHeroes().pipe(
          tapResponse(
            (heroes: Hero[]) => this.patchState({ heroes }),
            err => console.log(err)
          ),
          finalize(() => this.patchState({ loading: false }))
        )
      )
    )
  );

  readonly searchHeroes = this.effect<string>(
    pipe(
      tap(() => this.patchState({ loading: true })),
      debounceTime(300),
      scan((acc: string, curr: string) => {
        return !!acc && curr.includes(acc) ? acc : curr;
      }, ''),
      distinctUntilChanged(),
      switchMap((searchString: string) =>
        this._heroService.searchHeroes(searchString).pipe(
          tapResponse(
            (searchHeroes: Hero[]) => this.patchState({ searchHeroes }),
            err => console.log(err)
          ),
          finalize(() => this.patchState({ loading: false }))
        )
      )
    )
  );

  readonly addHero = this.effect((heroName$: Observable<string>) => {
    return heroName$.pipe(
      tap(() => this.patchState({ loading: true })),
      filter(Boolean),
      switchMap((name: string) =>
        this._heroService.addHero({ name } as Hero).pipe(
          tapResponse(
            (hero: Hero) => this._addHeroState(hero),
            err => console.log(err)
          ),
          catchError(() => EMPTY),
          finalize(() => this.patchState({ loading: false }))
        )
      )
    );
  });

  readonly deleteHero = this.effect((heroId$: Observable<number>) => {
    return heroId$.pipe(
      tap(() => this.patchState({ loading: true })),
      filter(Boolean),
      switchMap((heroId: number) =>
        this._heroService.deleteHero(heroId).pipe(
          tapResponse(
            () => {
              this._deleteHeroState(heroId);
            },
            err => console.log(err)
          ),
          catchError(() => EMPTY),
          finalize(() => this.patchState({ loading: false }))
        )
      )
    );
  });

  private readonly _deleteHeroState = this.updater((state: IHeroesState, id: number) => ({
    ...state,
    heroes: state.heroes.filter((hero: Hero) => hero.id !== id),
  }));

  private readonly _addHeroState = this.updater((state: IHeroesState, hero: Hero) => ({
    ...state,
    heroes: [...state.heroes, hero],
  }));

  // Store lifecycle
  ngrxOnStoreInit(): void {
    this.fetchHeroes();
  }

  ngrxOnStateInit(): void {}
}
