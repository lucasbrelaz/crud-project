import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACKBAR_DURATION } from '@shared/constant/duration.constant';
import { EUserStatus, IUser } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-create-edit-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './user-create-edit-dialog.component.html',
  styleUrl: './user-create-edit-dialog.component.scss',
})
export class UserCreateEditDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<UserCreateEditDialogComponent>);
  readonly data = inject<IUser | null>(MAT_DIALOG_DATA);

  userForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    status: [EUserStatus.ACTIVE, Validators.required],
  });

  ngOnInit(): void {
    if (this.data) {
      this.userForm.patchValue(this.data);
    }
  }

  confirmDialog(): void {
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      return;
    }

    if (this.data?.id) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  private createUser(): void {
    const payload = this.userForm.value;

    this.userService.createUser(payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.handleSuccess('criado');
      },
      error: () => {
        this.handleError('editar');
      },
    });
  }

  private updateUser(): void {
    const payload: IUser = {
      ...this.data!,
      ...this.userForm.value,
    };

    this.userService.updateUser(payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.handleSuccess('editado');
      },
      error: () => {
        this.handleError('editar');
      },
    });
  }

  private handleSuccess(type: string) {
    this.snackBar.open(`Usuário ${type} com sucesso.`, 'OK', { duration: SNACKBAR_DURATION });
  }

  private handleError(type: string) {
    this.snackBar.open(`Erro ao ${type}.`, 'Fechar', { duration: SNACKBAR_DURATION });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
