import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor() { }

  private getVariation(tauxReel:number, tauxFix:number) : number{
    return (Math.abs(tauxFix-tauxReel)/tauxReel)*100
  }
  shouldTurnOffCustomerChangeRate(tauxReel:number, tauxFix:number) : boolean{
    if(this.getVariation(tauxReel, tauxFix)>2) return true
    return false
  }

  updateChangeRate(changeRate:number) {
    let randomChange = (Math.random()*0.1) - 0.05
    changeRate += randomChange
  }
}
