import { Company } from './company';

export class User {
    id: number;
    password: string;
    enabled: Boolean;
    username: string;
    company: Company;
    workplace: Company;
    role: string;

}
