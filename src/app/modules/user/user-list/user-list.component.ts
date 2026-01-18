import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { SNACKBAR_DURATION } from '@shared/constant/duration.constant';
import { UserCreateEditDialogComponent } from '../user-create-edit-dialog/user-create-edit-dialog.component';
import { EUserStatus, IUser } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatTableModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  users = signal<IUser[]>([]);
  isLoading = signal<boolean>(false);
  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'actions'];

  UserStatus = EUserStatus;

  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar usuários', 'Fechar');
        this.isLoading.set(false);
      },
    });
  }

  deleteUser(user: IUser): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.users.update((userList) =>
            userList.filter((userToDelete) => userToDelete.id !== user.id),
          );
          this.snackBar.open('Usuário excluído com sucesso', 'OK', {
            duration: SNACKBAR_DURATION,
          });
        },
      });
    }
  }

  openUserCreateEditDialog(user?: IUser): void {
    const dialogRef = this.dialog.open(UserCreateEditDialogComponent, {
      width: '400px',
      data: user ? { ...user } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadUsers();
    });
  }
}
