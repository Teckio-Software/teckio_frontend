import { Component, Input } from '@angular/core';
import { ExistenciasService } from '../existencias.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { existenciasInsumosDTO } from '../tsExistencia';

@Component({
  selector: 'app-detalles-existencia',
  templateUrl: './detalles-existencia.component.html',
  styleUrls: ['./detalles-existencia.component.css']
})
export class DetallesExistenciaComponent {

  @Input()
  idAlmacenInput: number = 0;

  @Input()
  idInsumoInput: number = 0;

  selectedEmpresa : number = 0;
  detallesExistencia !: existenciasInsumosDTO[];
  constructor(private _existenciaService: ExistenciasService
    , private _SeguridadEmpresa: SeguridadService
  ){
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit() {
    this._existenciaService.obtenDetallesInsumosExistentes(this.selectedEmpresa, this.idAlmacenInput, this.idInsumoInput).subscribe((datos) => {
      this.detallesExistencia = datos;
    })
  }

}
