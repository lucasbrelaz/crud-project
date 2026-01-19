import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import {
  ConfirmDialogComponent,
  IConfirmDialogData,
} from '@shared/confirm-dialog/confirm-dialog.component';
import { SNACKBAR_DURATION } from '@shared/constant/duration.constant';
import { EmptyStateComponent } from '@shared/empty-state/empty-state.component';
import { DarkModeService } from '@shared/service/dark-mode.service';
import { catchError, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { UserCreateEditDialogComponent } from '../user-create-edit-dialog/user-create-edit-dialog.component';
import { EUserStatus, IUser } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    EmptyStateComponent,
    MatChipsModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly darkModeService = inject(DarkModeService);

  protected readonly EUserStatus = EUserStatus;

  pageSize = signal(5);
  pageIndex = signal(0);
  totalUsers = signal(0);

  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);
  private readonly refreshTrigger = signal<number>(0);

  isSearchEmpty = computed(
    () => !this.isLoading() && this.users().length === 0 && !!this.searchQuery(),
  );
  isDatabaseEmpty = computed(
    () => !this.isLoading() && this.users().length === 0 && !this.searchQuery(),
  );
  showTable = computed(() => !this.isLoading() && this.users().length > 0);

  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'actions'];

  private readonly usersStream$ = toObservable(
    computed(() => ({
      query: this.searchQuery(),
      refresh: this.refreshTrigger(),
      page: this.pageIndex() + 1,
      limit: this.pageSize(),
    })),
  ).pipe(
    debounceTime(400),
    tap(() => this.isLoading.set(true)),
    switchMap(({ query, page, limit }) =>
      this.userService.getUsers(query, page, limit).pipe(
        tap((res) => this.totalUsers.set(res.total)),
        map((res) => res.data as IUser[]),
        catchError(() => {
          this.snackBar.open('Erro ao carregar', 'Fechar');
          return of([] as IUser[]);
        }),
      ),
    ),
    tap(() => this.isLoading.set(false)),
  );

  users = toSignal(this.usersStream$, { initialValue: [] as IUser[] });

  isDarkMode = computed(() => this.darkModeService.currentTheme() === 'theme-dark');

  toggleDarkMode() {
    this.darkModeService.setTheme(
      this.darkModeService.currentTheme() === 'theme-dark' ? 'theme-light' : 'theme-dark',
    );
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.pageIndex.set(0);
  }

  refreshList(): void {
    this.refreshTrigger.update((currentValue) => currentValue + 1);
  }

  openDeleteUserDialog(user: IUser): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar exclusão',
        message: `Tem certeza que deseja excluir o usuário ${user.name}?`,
        type: 'warn',
      } as IConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.deleteUser(user);
    });
  }

  private deleteUser(user: IUser) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.snackBar.open('Usuário excluído com sucesso', 'OK', { duration: SNACKBAR_DURATION });
        this.refreshList();
      },
      error: () => this.snackBar.open('Erro ao excluir usuário', 'Fechar'),
    });
  }

  openUserCreateEditDialog(user?: IUser): void {
    const dialogRef = this.dialog.open(UserCreateEditDialogComponent, {
      width: '400px',
      data: user ? { ...user } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.refreshList();
    });
  }
}
