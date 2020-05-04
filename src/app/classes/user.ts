import { Company } from './company';

export class User {
    id: number;
    username: string;
    fullName: string;
    email: string;
    password: string;
    enabled: boolean;
    company?: Company;
    workplace: Company;
    role: string;

    constructor(username:string, fullName:string, email:string, password:string, enabled:boolean, company:Company, workplace:Company, role:string){
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
        this.company = company;
        this.workplace = workplace;
        this.role = role;
    }

}
