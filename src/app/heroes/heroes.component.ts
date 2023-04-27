import { Component } from '@angular/core';

import { Hero } from '../hero';
import { HeroesStore } from '../store/heroes.store';
import { provideComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  providers: [provideComponentStore(HeroesStore)],
})
export class HeroesComponent {
  vm$ = this._heroesStore.vm$;

  constructor(private _heroesStore: HeroesStore) {}

  add(name: string): void {
    this._heroesStore.addHero(name);
  }

  delete(hero: Hero): void {
    this._heroesStore.deleteHero(hero.id);
  }
}
