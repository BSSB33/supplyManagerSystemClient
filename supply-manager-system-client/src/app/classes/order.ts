import { Company } from './company';
import { User } from './user';

export class Order {
    id: number;
    productName: String;
    price: Number;
    status: String;
    buyer: Company;
    buyerManager?: User;
    seller: Company;
    sellerManager?: User;

    constructor(productName: String, price: Number, status: String, buyer: Company, buyerManager: User, seller: Company, sellerManager: User){
        this.productName = productName;
        this.price = price;
        this.status = status;
        this.buyer = buyer;
        this.sellerManager = sellerManager;
        this.seller = seller;
        this.buyerManager = buyerManager;
    }
}
