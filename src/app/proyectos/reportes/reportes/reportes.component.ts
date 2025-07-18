import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {
  selectedIndex: number = 0;
  totalConFormato : string = "0.00";
  appRecarga : number = 0;


  actualizaTotal(total : number){
    this.totalConFormato = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(total);
  }


  yourFn(event: any) {
    this.selectedIndex = event.index;
    this.appRecarga += 1;
  }

}
