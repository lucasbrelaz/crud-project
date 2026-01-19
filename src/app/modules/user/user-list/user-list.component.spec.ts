import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { EUserStatus } from '../user.model';
import { UserService } from '../user.service';
import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  // Mocks
  const userServiceMock = {
    getUsers: jasmine.createSpy('getUsers').and.returnValue(of({ data: [], total: 0 })),
    deleteUser: jasmine.createSpy('deleteUser').and.returnValue(of(null)),
  };

  const dialogMock = {
    open: jasmine.createSpy('open').and.returnValue({
      afterClosed: () => of(true),
    }),
  };

  const snackBarMock = {
    open: jasmine.createSpy('open'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init with default pagination', fakeAsync(() => {
    const mockResponse = {
      data: [
        {
          id: '1',
          name: 'Lucas',
          email: 'lucas@test.com',
          role: 'Admin',
          status: EUserStatus.ACTIVE,
          createdAt: new Date().toISOString(),
        },
      ],
      total: 1,
    };
    userServiceMock.getUsers.and.returnValue(of(mockResponse));

    fixture.detectChanges(); // ngOnInit / stream trigger
    tick(400); // debounceTime
    fixture.detectChanges();

    expect(userServiceMock.getUsers).toHaveBeenCalledWith('', 1, 5);
    expect(component.users()).toEqual(mockResponse.data);
    expect(component.totalUsers()).toBe(1);
    expect(component.showTable()).toBeTrue();
  }));

  it('should trigger search and call service with debounce', fakeAsync(() => {
    fixture.detectChanges();
    const query = 'developer';

    component.onSearchChange(query);

    // Antes de 400ms não deve ter chamado
    tick(200);
    expect(userServiceMock.getUsers).not.toHaveBeenCalledWith(query, 1, 5);

    // Após o debounce
    tick(200);
    fixture.detectChanges();
    expect(userServiceMock.getUsers).toHaveBeenCalledWith(query, 1, 5);
  }));

  it('should reset page index when search query changes', () => {
    component.pageIndex.set(2);
    component.onSearchChange('new search');
    // Se você não resetou no código ainda, esse teste vai falhar e te avisar para corrigir!
    // No seu código atual você não resetou. Adicione no componente.
    expect(component.pageIndex()).toBe(0);
  });

  it('should open dialog and refresh list on success', () => {
    const refreshSpy = spyOn(component, 'refreshList').and.callThrough();

    component.openUserCreateEditDialog();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should handle error from service and show snackbar', fakeAsync(() => {
    userServiceMock.getUsers.and.returnValue(throwError(() => new Error('API Error')));

    fixture.detectChanges();
    tick(400);

    expect(snackBarMock.open).toHaveBeenCalledWith('Erro ao carregar', 'Fechar');
    expect(component.users()).toEqual([]);
  }));
});
