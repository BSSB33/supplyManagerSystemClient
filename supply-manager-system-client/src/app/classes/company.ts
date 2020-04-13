export class Company {
    id: number;
    active: boolean;
    name: string;

    constructor(name: string, active: boolean){
        this.name = name;
        this.active = active;
    }
}
