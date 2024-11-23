import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BookService } from './../../shared/services/book-service/book.service';
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Book } from '../../shared/models/book.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmComponent } from '../../shared/components/modal-confirm/modal-confirm.component';
import { MatFormField } from '@angular/material/form-field';
import { ConfimModel } from '../../shared/models/confim.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage implements AfterViewInit {

  displayedColumns: string[] = ['image', 'title', 'author', 'year', 'action'];
  dataSource: MatTableDataSource<Book> = new MatTableDataSource<Book>();

  
  readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bookSrv: BookService,
  ) {
    this.bookSrv.getData().pipe(takeUntilDestroyed()).subscribe((books: Book[]) => {
      this.bookSrv.books = books;
      this.dataSource.data = books;
    });;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
  }
  // add edit
  addEditBook(item?: Book): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      minWidth: 800, minHeight: 400, maxHeight: 600,
      data: item ? item : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        result?.type === 'update' ? this.bookSrv.updateBook(result.data) : this.bookSrv.deleteBook(result.data);
        this.dataSource._updateChangeSubscription();
      }
    });
  }

  //delete
  deleteBook(item?: Book) {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      minWidth: 300, minHeight: 200, maxHeight: 400,
      data: <ConfimModel>{data: item ? item : null, title: `Would you like to delete book ${item?.title}`},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.bookSrv.deleteBook(result);
        this.dataSource._updateChangeSubscription();
      }
    });
  }

  updateTableData() {
    const updatedData: Book[] = this.bookSrv.books;
    this.dataSource.data = updatedData;
  }

  // filter list
  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createFilter() {
    return (data: Book, filter: string): boolean => {
      const terms = filter.split(' ').map((term) => term.toLowerCase());

      return terms.every((term) => 
        data?.title?.toLowerCase().includes(term) || data?.author?.toLowerCase().includes(term)
      );
    };
  }
}
