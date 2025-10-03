import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Logs } from './ts.auditorias';
import { AuditoriaService } from './auditorias.service';
import { SeguridadService } from '../seguridad.service';

@Component({
  selector: 'app-auditorias',
  templateUrl: './auditorias.component.html',
  styleUrls: ['./auditorias.component.css'],
})
export class AuditoriasComponent implements OnInit {

  constructor(
    private _seguridadService: SeguridadService,
    private _auditoriaService: AuditoriaService
  ){
    let IdEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
  }

  fechaInicio: string = '';
  fechaFin: string = '';
  filtroNivel: string = '';

  mostrarListaUsuario: boolean = false;
  nombreUsuario: string = '';
  listaLogs: Logs[] = [];
  listaLogsReset: Logs[] = [];
  listaUsuarios: string[] = [];
  listaUsuariosReset: string[] = [];


  isLoading: boolean = false;

  selectedEmpresa: number = 0;

  ngOnInit(): void { 
    this.obtenerAuditorias();
  }

  obtenerAuditorias(){
    this.isLoading = true;
    this._auditoriaService.obtenerTodos(this.selectedEmpresa).subscribe((datos) => {
      this.listaLogs = datos;
      this.listaLogsReset = datos;
      this.listaUsuarios = [
          ...new Set(this.listaLogs.map((z) => z.idUsuario.toString())),
        ];
        this.listaUsuariosReset = [
          ...new Set(this.listaLogs.map((z) => z.idUsuario.toString())),
        ];
      this.isLoading = false;
    })
  }

  seleccionNivel(event: any) {
    this.filtroNivel = event.target.value;
    this.filtrarLogs();
  }

  filtrarUsuario(event: Event) {
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.nombreUsuario = filterValue;
    this.listaUsuarios = this.listaUsuariosReset.filter((z) =>
      z.toLocaleLowerCase().includes(filterValue)
    );
    this.filtrarLogs();
  }

  seleccionarUsuario(usuario: string) {
    this.nombreUsuario = usuario;
    this.mostrarListaUsuario = false;
    this.filtrarLogs();
  }

  filtrarLogs(){
    this.listaLogs = this.listaLogsReset;
    
    if(this.filtroNivel!=''){
      this.listaLogs = this.listaLogs.filter((z) => z.nivel == this.filtroNivel);
    }

    if(this.nombreUsuario!=''){
      this.listaLogs = this.listaLogs.filter((z) => z.idUsuario.toString() == this.nombreUsuario);
    }
    
    const start = this.parseISOToLocal(this.fechaInicio);
    const end = this.parseISOToLocal(this.fechaFin);

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    this.listaLogs = this.listaLogs.filter((z) => {
      const d = this.toDate(z.fecha);
      if (!d) return false;
      return (!start || d >= start) && (!end || d <= end);
    });
    
  }

  private toDate(val: Date | string | null | undefined): Date | null {
    if (!val) return null;
    return val instanceof Date ? val : new Date(val);
  }

  private parseISOToLocal(iso: string): Date | null {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d); // ← local, sin saltos por zona
  }

  limpiarFiltros(){
    this.nombreUsuario = '';
    this.filtroNivel = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.filtrarLogs();
  }
}
