import { Company } from './company';
import { User } from './user';
import { Status } from '../status.enum';

export class Order {
    id: number;
    productName: string;
    price: number;
    status: Status;
    buyer: Company;
    buyerManager: User;
    seller: Company;
    sellerManager: User;
}
