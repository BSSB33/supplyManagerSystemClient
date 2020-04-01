import { User } from './user';
import { Order } from './order';

export class History {
    id: number;
    creator: User;
    order: Order;
    historyType: string;
    note: string;
    createdAt: Date;

    constructor(creator: User, order: Order, historyType: string, note: string){
        this.creator = creator;
        this.order = order;
        this.historyType = historyType;
        this.note = note;
    }
}
