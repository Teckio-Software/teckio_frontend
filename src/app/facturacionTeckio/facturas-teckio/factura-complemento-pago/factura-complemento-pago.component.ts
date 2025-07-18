import { Component, Input } from '@angular/core';
import { FacturasServiceService } from '../../facturas-service.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { FacturaComplementoPagoDTO } from '../../facturas';

@Component({
  selector: 'app-factura-complemento-pago',
  templateUrl: './factura-complemento-pago.component.html',
  styleUrls: ['./factura-complemento-pago.component.css'],
})
export class FacturaComplementoPagoComponent {
  @Input() IdFactura : number = 0;
  selectedEmpresa : number = 0;
  complementoPagos : FacturaComplementoPagoDTO[] = [];
  
  constructor(
    private _fcaturasService: FacturasServiceService,
    private _SeguridadEmpresa: SeguridadService
  ){
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    this._fcaturasService.ObtenComplementoPagoXIdFactura(this.selectedEmpresa, this.IdFactura).subscribe((datos) => {
      this.complementoPagos = datos;
    });
  }
}
