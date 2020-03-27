import { User } from './user';
import { Order } from './order';

export class History {
    id: number;
    creator: User;
    order: Order;
    historyType: string;
    createdAt: string;
}
