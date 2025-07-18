import { Component, EventEmitter, Input, Output } from '@angular/core';
import { almacenSalidaInsumosDTO } from '../../almacenSalidaInsumos/tsAlmacenSalidaInsumos';
import { AlmacenSalidaInsumosService } from '../../almacenSalidaInsumos/almacen-salida-insumos.service';
import { AlmacenEntradaDevolucionCreacionDTO } from '../../almacenEntrada/tsAlmacenEntrada';
import Swal from 'sweetalert2';
import { AlmacenEntradaService } from '../../almacenEntrada/almacen-entrada.service';

@Component({
  selector: 'app-almacen-salida-insumos',
  templateUrl: './almacen-salida-insumos.component.html',
  styleUrls: ['./almacen-salida-insumos.component.css']
})
export class AlmacenSalidaInsumosComponent {

  @Input()
  idProyectoInput: number = 0;

  @Input()
  idEmpresaInput: number = 0;
  
  @Input()
  idSalidaAlmacenInput: number = 0;

  @Output() valueChangeTodosISA = new EventEmitter();
  @Output() recargar = new EventEmitter();

  insumossalidaalmacen !: almacenSalidaInsumosDTO[];
  existenPrestamos : boolean = false;
  todos : boolean = false;

  almacenEntradaCreacion: AlmacenEntradaDevolucionCreacionDTO = {
    idAlmacen: 0,
    idContratista: 0,
    listaInsumosPrestamo: [],
    observaciones: ''
  }

  constructor(private _inusmosSalidaAlmacenService : AlmacenSalidaInsumosService,
    private _AlmacenEntradaService: AlmacenEntradaService,
  ){}

  ngOnInit() {
    if(this.idSalidaAlmacenInput > 0){
      this.todos = true;
    }
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.insumossalidaalmacen = [];

    if(this.idSalidaAlmacenInput > 0){
      this._inusmosSalidaAlmacenService.ObtenXIdSalidaAlmacen(this.idEmpresaInput, this.idSalidaAlmacenInput).subscribe((datos) => {
        this.insumossalidaalmacen = datos;
        var existenPrestamosPendiantes = this.insumossalidaalmacen.filter(z => z.prestamoFinalizado == false && z.esPrestamo == true);
        var existenInsumosPrestamos = this.insumossalidaalmacen.filter(z => z.esPrestamo == true);
        console.log(existenPrestamosPendiantes);
        this.existenPrestamos = false;
        if(existenPrestamosPendiantes.length > 0 && existenInsumosPrestamos.length > 0){
          this.existenPrestamos = true;
        }
      });
    }
  }

  finalizarPrestamo(){
    let prestamos = this.insumossalidaalmacen.filter(z => z.seleccionado == true);
    console.log("insumos prestados", prestamos);
    this.almacenEntradaCreacion.observaciones = "";

    this.almacenEntradaCreacion.listaInsumosPrestamo = prestamos;

    console.log(this.almacenEntradaCreacion);

    if (this.almacenEntradaCreacion.listaInsumosPrestamo.length <= 0
    ) {
      Swal.fire({
        title: "Error",
        text: "No hay insumos seleccionados",
        icon: "error"
      });
    }else{
      this._AlmacenEntradaService.CrearDevolucionEntradaAlmacen(this.idEmpresaInput, this.almacenEntradaCreacion).subscribe((datos) => {
        if (datos.estatus) {
          this.cargarRegistros();
        } else {
          Swal.fire({
            title: "Error",
            text: datos.descripcion,
            icon: "error"
          });
        }
      });
    } 
  }

  // verTodos(){
  //   this.valueChangeTodosISA.emit(0);
  // }
}
