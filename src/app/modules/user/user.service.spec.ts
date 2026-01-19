import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EUserStatus, IUser } from './user.model';
import { UserService } from './user.service';

const mockUser: IUser = {
  id: '1',
  name: 'Lucas',
  email: 'lucas@test.com',
  role: 'Dev',
  status: EUserStatus.ACTIVE,
  createdAt: '2026-01-16T10:00:00Z',
};

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://localhost:3000/users';

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all users when no query is provided', fakeAsync(() => {
    const mockUsers: IUser[] = [mockUser];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    tick(800); // Wait for the delay(800) defined in the service
  }));

  it('should fetch filtered users when query is provided', fakeAsync(() => {
    const query = 'lucas';
    service.getUsers(query).subscribe();

    const req = httpMock.expectOne(`${API_URL}?q=${query}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);

    tick(800);
  }));

  it('should create a new user via POST', () => {
    const { ...userToCreate } = mockUser;

    service.createUser(userToCreate).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userToCreate);
    req.flush(mockUser);
  });

  it('should update an existing user via PUT', () => {
    service.updateUser(mockUser).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${API_URL}/${mockUser.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  it('should delete a user via DELETE', () => {
    const userId = 'c870';
    service.deleteUser(userId).subscribe();

    const req = httpMock.expectOne(`${API_URL}/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle API errors and return an Error observable', fakeAsync(() => {
    service.getUsers().subscribe({
      next: () => fail('Should have failed with 404 error'),
      error: (error: Error) => {
        expect(error.message).toContain('Código do erro: 404');
      },
    });

    // 1. Resolve the initial request with an error status
    const firstReq = httpMock.expectOne(API_URL);
    firstReq.flush('Not Found', { status: 404, statusText: 'Not Found' });

    // 2. Resolve the second attempt triggered by the retry(1) operator
    const retryReq = httpMock.expectOne(API_URL);
    retryReq.flush('Not Found', { status: 404, statusText: 'Not Found' });

    // 3. Advance virtual time to clear the delay(800) in the pipe
    tick(800);
  }));
});
