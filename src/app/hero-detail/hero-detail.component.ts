import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, switchMap } from 'rxjs';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent {

  hero$: Observable<Hero> =
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = parseInt(params.get('id') || '', 10);
          return this.heroService.getHero(id);
        }),
      );
  
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  save(hero: Hero): void {
    if (hero) {
      this.heroService.updateHero(hero)
        .subscribe(() => this.goBack());
    }
  }
}
