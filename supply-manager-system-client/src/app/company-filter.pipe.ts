import { Pipe, PipeTransform } from '@angular/core';
import { Company } from './classes/company';

@Pipe({
  name: 'companyFilter'
})
export class CompanyFilterPipe implements PipeTransform {

  transform(value: Company[], filterBy: string): Company[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
    return filterBy ? value.filter((company: Company) =>
      company.name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
