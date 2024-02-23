import { Component } from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faArrowsRotate} from "@fortawesome/free-solid-svg-icons";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {DecimalPipe, JsonPipe, NgClass} from "@angular/common";
import {timeInterval} from "rxjs";
import {StorageService} from "../../service/storage/storage.service";
import {ConverterService} from "../../service/converter.service";
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {AlertComponent} from "../alert/alert.component";
import {TableComponent} from "../table/table.component";


@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    NgClass,
    DecimalPipe,
    MatDialogContent,
    MatDialogActions,
    AlertComponent,
    TableComponent,
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css'
})
export class ConverterComponent {
  faArrowsRotate = faArrowsRotate;
  converterForm : FormGroup
  convertFromCurr : string = "EUR"
  convertToCurr : string = "USD"
  changeRate : number = 1.1
  amount : number | undefined
  fixedAmount : number | undefined
  result : number | undefined
  isHidden: boolean = true
  tauxFix: number | undefined
  tauxFixeChecked: boolean = false
  hideIt: boolean = false
  table : any[] = []
  triggerAlert: boolean = false
  AutoUncheckcheckCheckBox: boolean = false
  CHANGE_RATE_DURATION: number = 3000

  constructor(private formBuider : FormBuilder, private storageService : StorageService, private converterService:ConverterService) {
    setTimeout(()=>{
      converterService.updateChangeRate(this.changeRate)
      if(!this.isHidden && !this.tauxFixeChecked ){
        this.update()
      }
    },this.CHANGE_RATE_DURATION)
    this.converterForm = this.formBuider.group({
      amount : [0, [Validators.required]]
    })
  }

  switch() {
    [this.convertFromCurr,this.convertToCurr] = [this.convertToCurr,this.convertFromCurr]
    if(this.result && this.amount)
        [this.amount,this.result] = [this.result, this.amount]
  }
  convert(){
    if(this.amount){
      this.table = []
      this.fixedAmount = this.amount
      const changeRate : number = this.getChangeRate()
      if(this.convertFromCurr == "EUR")
        this.result = this.amount * changeRate
      else if(this.convertFromCurr == "USD")
        this.result = this.amount * (1/changeRate)
    }
    this.isHidden = false
    this.hideIt = false
    let storedRow = {
      realRate : this.convertFromCurr=='EUR' ? this.changeRate : 1/this.changeRate,
      customRate : this.tauxFixeChecked ? this.tauxFix : null,
      initValue : this.amount,
      calculatedValue : this.result,
      operation : this.convertFromCurr+" vers "+this.convertToCurr
    }
    this.storageService.save(storedRow)
    this.table = this.storageService.getTable()
  }

  isTauxFixChecked() {
    this.tauxFixeChecked = !this.tauxFixeChecked
    this.hideIt = true
  }

  getChangeRate() {
    let shouldTurnOffCheckBox = this.tauxFix==undefined ? true : this.converterService.shouldTurnOffCustomerChangeRate(this.changeRate,this.tauxFix)
    if (this.tauxFixeChecked &&
      this.tauxFix &&
      !shouldTurnOffCheckBox ){
      return this.tauxFix
    }
    if(shouldTurnOffCheckBox  && this.tauxFixeChecked) {
      this.tauxFixeChecked = false
      this.triggerAlert = true
      setTimeout(()=>{
        this.triggerAlert = false
      },4000)
    }
    return this.changeRate
  }

  private update() {
    if(this.fixedAmount){
      const changeRate : number = this.getChangeRate()
      if(this.convertFromCurr == "EUR")
        this.result = this.fixedAmount * changeRate
      else if(this.convertFromCurr == "USD")
        this.result = this.fixedAmount * (1/changeRate)
    }
  }
}
