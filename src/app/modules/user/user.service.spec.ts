import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EUserStatus, IUser } from '@modules/user/user.model';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://localhost:3000/users';

  const mockUser: IUser = {
    id: 'c870',
    name: 'Lucas',
    email: 'lucas@test.com',
    role: 'Developer',
    status: EUserStatus.ACTIVE,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch paginated users and extract total from headers', fakeAsync(() => {
    service.getUsers().subscribe((response) => {
      expect(response.data).toEqual([mockUser]);
      expect(response.total).toBe(10);
    });

    const req = httpMock.expectOne(`${API_URL}?_page=1&_limit=5`);
    expect(req.request.method).toBe('GET');
    req.flush([mockUser], { headers: { 'X-Total-Count': '10' } });

    tick(800);
  }));

  it('should fetch filtered and paginated users when query is provided', fakeAsync(() => {
    const query = 'lucas';
    service.getUsers(query).subscribe();

    const req = httpMock.expectOne(`${API_URL}?_page=1&_limit=5&q=${query}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockUser], { headers: { 'X-Total-Count': '1' } });

    tick(800);
  }));

  it('should handle API errors and return an Error observable with retry logic', fakeAsync(() => {
    service.getUsers().subscribe({
      next: () => fail('Should have failed'),
      error: (error: Error) => {
        expect(error.message).toContain('Código do erro: 404');
      },
    });

    const firstReq = httpMock.expectOne(`${API_URL}?_page=1&_limit=5`);
    firstReq.flush('Not Found', { status: 404, statusText: 'Not Found' });

    const retryReq = httpMock.expectOne(`${API_URL}?_page=1&_limit=5`);
    retryReq.flush('Not Found', { status: 404, statusText: 'Not Found' });

    tick(800);
  }));

  it('should create a new user via POST', () => {
    const { ...userToCreate } = mockUser;
    service.createUser(userToCreate).subscribe();
    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });
});
