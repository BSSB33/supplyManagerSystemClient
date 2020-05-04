import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../classes/order';

@Pipe({
  name: 'archivedFilter'
})
export class ArchivedFilterPipe implements PipeTransform {

  transform(value: Order[], filterBy: boolean): Order[] {
    filterBy = filterBy ? filterBy : null;
    return filterBy ? value.filter((product: Order) =>
      !product.archived) : value;
  }

}
