import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactComponentDirective } from '../react-component.directive';
import { GanttComponent } from './ganttComponent';
import { SeguridadService } from '../seguridad/seguridad.service';
// import { Hola } from './ganttComponent';

@Component({
  selector: 'gantt',
  standalone: true,
  // styleUrls: ['./planby.css'],
  imports: [CommonModule, ReactComponentDirective],
  template: `<div
    class=" w-full h-full"
    [reactComponent]="reactComponent"
    [props]="reactProps"
  ></div>`,
})
export class GanttComponentNG {
  reactComponent = GanttComponent;
  selectedEmpresa: number = 0;
  selectedProyecto: number = 0;
  reactProps = { 
    loading: false, 
    selectedEmpresa: this.selectedEmpresa, 
    selectedProyecto: this.selectedProyecto 
  };

  constructor(private _seguridadService: SeguridadService) {}

  ngOnInit() {
    this.selectedEmpresa = Number(this._seguridadService.obtenIdEmpresaLocalStorage());
    this.selectedProyecto = Number(this._seguridadService.obtenerIdProyectoLocalStorage());
    this.updateReactProps();
  }

  updateReactProps() {
    this.reactProps = {
      loading: false,
      selectedEmpresa: this.selectedEmpresa,
      selectedProyecto: this.selectedProyecto,
    };
  }

  
}
