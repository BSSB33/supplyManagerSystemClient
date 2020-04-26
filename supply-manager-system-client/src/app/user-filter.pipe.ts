import { Pipe, PipeTransform } from '@angular/core';
import { User } from './classes/user';

@Pipe({
  name: 'userFilter',
  pure: false
})
export class UserFilterPipe implements PipeTransform {
  transform(value: User[], filterBy: string): User[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
    return filterBy ? value.filter((user: User) =>
      user.username.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }
}
