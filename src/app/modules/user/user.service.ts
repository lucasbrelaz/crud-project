import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, retry } from 'rxjs/operators';
import { IUser } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = 'http://localhost:3000/users';

  http = inject(HttpClient);

  getUsers(): Observable<IUser[]> {
    return this.http
      .get<IUser[]>(this.API_URL)
      .pipe(delay(800), retry(2), catchError(this.handleError));
  }

  createUser(user: Omit<IUser, 'id'>): Observable<IUser> {
    return this.http.post<IUser>(this.API_URL, user).pipe(catchError(this.handleError));
  }

  updateUser(user: IUser): Observable<IUser> {
    return this.http
      .put<IUser>(`${this.API_URL}/${user.id}`, user)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código do erro: ${error.status}, mensagem: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
