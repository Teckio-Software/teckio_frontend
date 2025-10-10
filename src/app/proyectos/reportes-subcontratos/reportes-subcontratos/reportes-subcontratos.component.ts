import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes-subcontratos',
  templateUrl: './reportes-subcontratos.component.html',
  styleUrls: ['./reportes-subcontratos.component.css']
})
export class ReportesSubcontratosComponent {

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
