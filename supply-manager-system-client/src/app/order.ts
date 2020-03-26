import { Company } from './company';
import { User } from './user';

export class Order {
    id: number;
    productName: string;
    price: number;
    status: string;
    buyer: Company;
    buyerManager: User;
    seller: Company;
    sellerManager: User;
}
