import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../classes/order';
import { User } from '../classes/user';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(value: Order[], filterBy: string): Order[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
    return filterBy ? value.filter((product: Order) =>
      product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }
}