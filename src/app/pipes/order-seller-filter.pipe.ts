import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../classes/order';

@Pipe({
  name: 'orderSellerFilter'
})
export class OrderSellerFilterPipe implements PipeTransform {

  transform(value: Order[], filterBy: string): Order[] {
    filterBy = filterBy ? filterBy : "";
    return filterBy ? value.filter((order: Order) =>
    order.seller.name == filterBy) : value;
  }

}
