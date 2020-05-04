import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../classes/order';

@Pipe({
  name: 'orderBuyerFilter'
})
export class OrderBuyerFilterPipe implements PipeTransform {

  transform(value: Order[], filterBy: string): Order[] {
    filterBy = filterBy ? filterBy : "";
    return filterBy ? value.filter((order: Order) =>
    order.buyer.name == filterBy) : value;
  }

}
