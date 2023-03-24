import { Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: HeroSearchComponent,
      multi: true
    }]
})
export class HeroSearchComponent implements ControlValueAccessor{
  search = '';

  onChange: any = () => {}
  onTouch: any = () => {}

  constructor() {}

  get value(): string {
    return this.search;
  }

  set value(val: string){
      this.search = val
      this.onChange(val)
      this.onTouch(val)
  }

  writeValue(value: any){
    this.value = value
  }

  registerOnChange(fn: any){
    this.onChange = fn
  }

  registerOnTouched(onTouched: Function) {
    this.onTouch = onTouched;
  }
}
