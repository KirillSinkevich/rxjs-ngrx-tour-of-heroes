import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false,
})
export class FilterPipe implements PipeTransform {
  transform<T extends { name: string }>(list: T[], filter: string): T[] {
    if (!list || !filter) {
      return list;
    }

    return list.filter((item: T) => item.name.toLowerCase().includes(filter.toLowerCase()));
  }
}
