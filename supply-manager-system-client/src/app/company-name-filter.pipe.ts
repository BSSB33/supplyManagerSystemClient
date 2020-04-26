import { Pipe, PipeTransform } from '@angular/core';
import { Company } from './classes/company';
import { User } from './classes/user';

@Pipe({
  name: 'companyNameFilter'
})
export class CompanyNameFilterPipe implements PipeTransform {

  transform(value: User[], filterBy: number): User[] {
    filterBy = filterBy ? filterBy : 0;
    return filterBy ? value.filter((user: User) =>
    user.workplace.id == filterBy) : value;
  }

}
