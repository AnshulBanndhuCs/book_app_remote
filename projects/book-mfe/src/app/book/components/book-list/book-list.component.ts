import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookClient, BookVM } from 'projects/book-mfe/src/model';
import { async } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent {
  public bookList: BookVM[] = [];

  display = false;
  onPress() {
    this.router.navigate(['books/newbook']);
  }

  constructor(private modelService: BookClient, private router: Router) {}

  ngOnInit() {
    // debugger
    this.getAll();
  }

  getAll() {
    // debugger
    this.modelService.getAllBooks().subscribe(
      async (response) => {
        // this.bookList = response;
        const bList = await response?.data.text();
        // console.log(bList);
        this.bookList = JSON.parse(bList as string);
        // console.log(this.bookList);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  DeleteClick(id: number) {
    // alert('Sure!!!')
    Swal.fire({
      title: 'Are you sure?',
      text: 'Data will be removed permanently !!!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result: { value: any; dismiss: any }) => {
      if (result.value) {
        this.modelService.deleteBook(id).subscribe(
          (response) => {
            this.getAll();
          },
          (error) => {
            console.log(error);
          }
        );
        Swal.fire('Removed!', 'Record removed successfully.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Record still in our database.)', 'error');
      }
    });
  }
}
