import { Company } from './company';
import { User } from './user';

export class Order {
    id: number;
    productName: String;
    price: Number;
    status: String;
    archived: boolean;
    buyer: Company;
    buyerManager?: User;
    seller: Company;
    sellerManager?: User;
    createdAt: String;
    modifiedAt: String;
    description: String;

    constructor(productName: String, price: Number, status: String, archived: boolean, buyer: Company, buyerManager: User, seller: Company, sellerManager: User, description: String){
        this.productName = productName;
        this.price = price;
        this.status = status;
        this.archived = archived;
        this.buyer = buyer;
        this.sellerManager = sellerManager;
        this.seller = seller;
        this.buyerManager = buyerManager;
        this.description = description;
    }
}
