import { Company } from './company';

export class User {
    id: number;
    username: string;
    password: string;
    enabled: Boolean;
    company?: Company;
    workplace: Company;
    role: string;

    constructor(username:string, password:string, enabled:boolean, company:Company, workplace:Company, role:string){
        this.username = username;
        this.password = password;
        this.enabled = enabled;
        this.company = company;
        this.workplace = workplace;
        this.role = role;
    }

}
