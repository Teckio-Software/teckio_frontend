import { Component, Input } from '@angular/core';
import { FacturasServiceService } from '../../facturas-service.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { FacturaDetalleDTO } from '../../facturas';

@Component({
  selector: 'app-factura-detalle',
  templateUrl: './factura-detalle.component.html',
  styleUrls: ['./factura-detalle.component.css']
})
export class FacturaDetalleComponent {

@Input() IdFactura : number = 0;
selectedEmpresa : number = 0;
facturaDetalles : FacturaDetalleDTO[] = [];
facturaDetallesReset : FacturaDetalleDTO[] = [];


  constructor(
    private _fcaturasService: FacturasServiceService,
    private _SeguridadEmpresa: SeguridadService
  ){
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    this._fcaturasService.ObtenFacturaDetalleXIdFactura(this.selectedEmpresa, this.IdFactura).subscribe((datos) => {
      this.facturaDetalles = datos;
      this.facturaDetallesReset = datos;
    });
  }

}
