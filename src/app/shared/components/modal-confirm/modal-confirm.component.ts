import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { MatButtonModule } from '@angular/material/button';
import type { ConfimModel } from '../../models/confim.model';

@Component({
  selector: 'app-modal-confirm',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    MatButtonModule,
  ],
  templateUrl: './modal-confirm.component.html',
  styleUrl: './modal-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfimModel,
    private dialogRef: MatDialogRef<ModalComponent>,
  ) {}

  confirm() {
    this.dialogRef.close(this.data.data);
  }
  cancel() {
    this.dialogRef.close();
  }
}
