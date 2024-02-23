import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  table: Object[] = []
  save(item : Object){
    this.table.push(item)
    if (this.table.length > 5)
      this.table.shift()
  }
  getTable() : any[] {
    return this.table
  }
}
