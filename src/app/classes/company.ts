export class Company {
    id: number;
    active: boolean;
    name: string;
    address: string;
    taxNumber: string;
    bankAccountNumber: string;
    lat: string;
    lon: string;

    constructor(name: string, active: boolean, address: string, taxNumber: string, bankAccountNumber: string, lat: string, lon: string){
        this.name = name;
        this.active = active;
        this.address = address;
        this.taxNumber = taxNumber;
        this.bankAccountNumber = bankAccountNumber;
        this.lat = lat;
        this.lon = lon;
    }
}
