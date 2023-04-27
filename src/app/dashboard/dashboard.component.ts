import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { HeroService } from '../hero.service';
import { HeroesStore } from '../store/heroes.store';
import { provideComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [provideComponentStore(HeroesStore)],
})
export class DashboardComponent {
  searchControl: FormControl = new FormControl<string>('');
  vm$ = this._heroesStore.vm$;

  constructor(private _heroesStore: HeroesStore, private heroService: HeroService) {
    this.searchControl.valueChanges.pipe(tap((searchString: string) => this._heroesStore.searchHeroes(searchString)));
  }

  get searchCntrValue(): string {
    return this.searchControl.value;
  }
}
