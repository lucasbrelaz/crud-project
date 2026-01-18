import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateEditDialogComponent } from './user-create-edit-dialog.component';

describe('UserCreateEditDialogComponent', () => {
  let component: UserCreateEditDialogComponent;
  let fixture: ComponentFixture<UserCreateEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreateEditDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
