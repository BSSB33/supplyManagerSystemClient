import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleFilterComponent } from './user-role-filter.component';

describe('UserRoleFilterComponent', () => {
  let component: UserRoleFilterComponent;
  let fixture: ComponentFixture<UserRoleFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoleFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
