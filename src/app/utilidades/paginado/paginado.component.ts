import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginado',
  templateUrl: './paginado.component.html',
  styleUrls: ['./paginado.component.css']
})
export class PaginadoComponent implements OnInit {
  @Input() totalItems: any;
  @Input() currentPage: any;
  @Input() itemsPerPage: any;
  @Output() onClick: EventEmitter<number> = new EventEmitter();
  totalPages = 0;
  pages: number[] = [];
  constructor() {
  }
  ngOnInit(): void {
    if (this.totalItems) {
      this.totalPages = this.totalItems / this.itemsPerPage;
      this.pages = Array.from({length: this.totalPages}, (_, i) => i+1);
    }
  }
  pageClicked(parametro: number){

  }
}
