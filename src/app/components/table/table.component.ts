import {Component, input} from '@angular/core';
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    DecimalPipe
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  table = input<any[]>()
}
