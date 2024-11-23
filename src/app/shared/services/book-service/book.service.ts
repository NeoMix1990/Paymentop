import { Injectable } from '@angular/core';
import { Book } from '../../models/book.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  books: Book[];

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get<Book[]>('assets/books.json');
  }

  updateBook(updatedBook: Book) {
    const books = this.books;
    const index = books.findIndex((item) => item.id === updatedBook.id);
    if (index !== -1) {
      books[index] = updatedBook;
    } else {
      books.unshift(updatedBook);
    }
  }

  deleteBook(book: Book) {
    const books = this.books;
    const index = books.findIndex(x => x.id === book.id);
    if (index > -1) {
      books.splice(index, 1);
    }
  }

}
