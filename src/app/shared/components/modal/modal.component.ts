import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { generateGuid } from '../../functions/generate-guid';
import { ConfimModel } from '../../models/confim.model';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { Book } from './../../models/book.model';
import { Languages } from '../../models/languages.model';
import { trigger, transition, style, animate } from '@angular/animations';


//Strictly Typed Forms Angular
type FormControlsOf<T> = {
  [K in keyof T]: FormControl<T[K]>
};

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogClose,
    MatTooltipModule,
    MatSelectModule,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0ms', style({ opacity: 0 }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements OnInit {

  showEditMode = false;

  toggleEditMode() {
    this.showEditMode = !this.showEditMode;
  }

  bookForm: FormGroup<FormControlsOf<Book>>;
  @ViewChild('fileInput') fileInput: ElementRef;
  readonly dialog = inject(MatDialog);
  language: Languages[] = [ 
    {
      id: 'ua',
      value: 'Ukraine'
    },{
      id: 'en',
      value: 'English'
    },{
      id: 'ru',
      value: 'Russian'
    },
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalComponent>,
    private fb: NonNullableFormBuilder,
    private cd: ChangeDetectorRef,
  ) {

  }
  ngOnInit(): void {
    this.initForm();
    if (this.data?.item) {
      this.bookForm.setValue(this.data?.item);
    }
  }

  initForm() {
    this.bookForm = this.fb.group({
      id: this.fb.control(this.data?.item ? this.data?.item?.id : generateGuid()),
      image: this.fb.control(''),
      title: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
      year: this.fb.control(1900, [Validators.required, Validators.min(1900), Validators.maxLength(4)]),
      author: this.fb.control('', [Validators.required, Validators.maxLength(40)]),
      edition: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
      description: this.fb.control('', [Validators.maxLength(1000)]),
      genre: this.fb.control('', [Validators.required, Validators.maxLength(70)]),
      pages: this.fb.control(10, [Validators.required, Validators.min(10), Validators.maxLength(4)]),
      language: this.fb.control('', [Validators.required]),
      costs: this.fb.control(20, [Validators.required, Validators.min(10), Validators.maxLength(5)]),
    }) as FormGroup<FormControlsOf<Book>>; // Strictly Typed Forms Angular
  }

  setImage(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget?.files?.[0]) {
      const file = eventTarget.files[0];
      const reader = new FileReader();
      if (file?.size > 50000) {
        alert('file so big, max size file 50kb')
        return;
      }
      reader.addEventListener('load', () => {
        if (reader?.result) {
          this.bookForm.get('image')?.setValue(reader.result as string);
          this.cd.markForCheck();
        }
      });
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.fileInput.nativeElement.value = '';
    this.bookForm.get('image')?.setValue('');
  }

  confirm(book: Book) {
    this.dialogRef.close({ data: book, type: 'update' });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  deleteBook() {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      minWidth: 300, minHeight: 200, maxHeight: 400,
      data: <ConfimModel>{data: this.data?.item ? this.data?.item : null, title: `Would you like to delete book ${this.data?.item?.title}`},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.dialogRef.close({ data: this.data?.item, type: 'delete' });
      }
    });
  }
}
