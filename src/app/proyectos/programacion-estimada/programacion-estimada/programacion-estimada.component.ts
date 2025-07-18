import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Injectable,
  HostBinding,
  Renderer2,
} from '@angular/core';
import { ProyectoService } from '../../proyecto/proyecto.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { proyectoDTO } from '../../proyecto/tsProyecto';
import { ProgramacionEstimadaService } from '../programacion-estimada.service';
import { programacionEstimadaDTO } from '../tsProgramacionEstimada';
import { precioUnitarioDetalleDTO } from '../../precio-unitario-detalle/tsPrecioUnitarioDetalle';
import { PrecioUnitarioService } from '../../precio-unitario/precio-unitario.service';
import { InsumoParaExplosionDTO } from 'src/app/catalogos/insumo/tsInsumo';
import { auto } from '@popperjs/core';
// import { random, randomItems } from '../helper';

declare var google: any;
@Component({
  selector: 'app-programacion-estimada',
  templateUrl: './programacion-estimada.component.html',
  styleUrls: ['./programacion-estimada.component.css'],
  providers: [],
})
export class ProgramacionEstimadaComponent {
  selectedProyecto: number = 0;
  selectedEmpresa: number = 0;

  constructor(private _seguridadService: SeguridadService) {
    let idEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    let idProyecto = _seguridadService.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(idProyecto);
    this.selectedEmpresa = Number(idEmpresa);
  }
}
