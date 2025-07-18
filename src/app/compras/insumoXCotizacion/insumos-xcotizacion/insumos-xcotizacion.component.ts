import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InsumoXCotizacionService } from '../insumoxcotizacion.service';
import { insumoXCotizacionDTO } from '../tsInsumoXCotizacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insumos-xcotizacion',
  templateUrl: './insumos-xcotizacion.component.html',
  styleUrls: ['./insumos-xcotizacion.component.css']
})
export class InsumosXcotizacionComponent {

  insumoXCotizacion: insumoXCotizacionDTO[] = [];
  constructor(private _InsumosXCotizacion: InsumoXCotizacionService) { }


  @Input()
  idRequisicionInput: number = 0;
  @Input()
  idEmpresaInput: number = 0;
  @Input()
  idProyectoInput: number = 0;
  @Input()
  idCotizacionInput: number = 0;

  @Output() valueChangeTodosIC = new EventEmitter();

  todos : boolean = false;
  ngOnInit() {
    if(this.idCotizacionInput > 0){
      this.todos = true;
    }
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.insumoXCotizacion = [];
    if (this.idCotizacionInput <= 0) {
      if (this.idRequisicionInput > 0 && this.idEmpresaInput > 0) {
        this._InsumosXCotizacion.ObtenTodos(this.idEmpresaInput, this.idRequisicionInput, this.idProyectoInput)
          .subscribe((datos) => {
            this.insumoXCotizacion = datos;
            this.insumoXCotizacion.forEach(element => {
              if (element.estatusInsumoCotizacion == 1) {
                element.estatusInsumoCotizacionBool = true;
                element.esSeleccionada = false;
                element.codigo = "";
              }
            });
          });
      }
    }else{
      if (this.idRequisicionInput > 0 && this.idEmpresaInput > 0) {
        this._InsumosXCotizacion.ObtenXIdCotizacion(this.idEmpresaInput, this.idCotizacionInput)
          .subscribe((datos) => {
            this.insumoXCotizacion = datos;
            this.insumoXCotizacion.forEach(element => {
              if (element.estatusInsumoCotizacion == 1) {
                element.estatusInsumoCotizacionBool = true;
                element.esSeleccionada = false;
                element.codigo = "";
              }
            });
          });
      }
    }
  }

  AutorizarInusmo(idInsumoCotizado:number){
    this._InsumosXCotizacion.AutorizarXId(this.idEmpresaInput, idInsumoCotizado).subscribe((datos)=>{
      if(datos.estatus){
        Swal.fire({
          title: "Correcto",
          text: datos.descripcion,
          icon: "success"
        });
      }else{
        Swal.fire({
          title: "Correcto",
          text: datos.descripcion,
          icon: "success"
        });
      }
    })
    this.cargarRegistros();
  }

  SeleccionarInsumoCotizacion(idInsumoCotizado: number){
    this.insumoXCotizacion.forEach(element =>{
      if(element.id == idInsumoCotizado && element.esSeleccionada == false){
        element.esSeleccionada = true;
      }else if(element.id == idInsumoCotizado && element.esSeleccionada == true){
        element.esSeleccionada = false;
      }
    });
  }

  AutorizarInsumosCotizadosSeleccionados(){
    var insumosSeleccionados=this.insumoXCotizacion.filter(z => z.esSeleccionada == true);
    if(insumosSeleccionados.length <= 0){
      Swal.fire({
        title: "error",
        text: "Debe seleccionar algunos insumos cotizados",
        icon: "error"
      });
    }else{
      this._InsumosXCotizacion.AutorizarInsumosCotizadosSeleccionados(this.idEmpresaInput, insumosSeleccionados).subscribe((datos)=>{
        if(datos.estatus){
          Swal.fire({
            title: "Correcto",
            text: datos.descripcion,
            icon: "success"
          });
        }else{
          Swal.fire({
            title: "Correcto",
            text: datos.descripcion,
            icon: "success"
          });
        }
      })
      this.cargarRegistros();
    }
  }

  verTodos(){
    this.valueChangeTodosIC.emit(0);
  }
}
