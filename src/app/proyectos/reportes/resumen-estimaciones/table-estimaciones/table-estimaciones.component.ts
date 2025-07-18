import { Component, Input } from '@angular/core';
import { EstimacionesDTO } from 'src/app/proyectos/estimaciones/tsEstimaciones';

@Component({
  selector: 'app-table-estimaciones',
  templateUrl: './table-estimaciones.component.html',
  styleUrls: ['./table-estimaciones.component.css']
})
export class TableEstimacionesComponent {
  @Input() estimaciones: any;


  expansionDominio(estimacion: EstimacionesDTO): void {
    estimacion.expandido = !estimacion.expandido;
  }


}
