import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlmacenEntradaInsumoService } from '../../almacenEntradaInsumo/almacen-entrada-insumo.service';
import { AlmacenEntradaInsumosDTO } from '../../almacenEntradaInsumo/tsAlmacenEntradaInsumo';

@Component({
  selector: 'app-almacene-entrada-insumos',
  templateUrl: './almacene-entrada-insumos.component.html',
  styleUrls: ['./almacene-entrada-insumos.component.css']
})
export class AlmaceneEntradaInsumosComponent {

  constructor(private _inusmosEntradaAlmacenService: AlmacenEntradaInsumoService) { }

  @Input()
  idProyectoInput: number = 0;
  @Input()
  idRequisicionInput: number = 0;
  @Input()
  idEmpresaInput: number = 0;
  @Input()
  idCotizacionInput: number = 0;
  @Input()
  idOrdenCompraInput: number = 0;
  @Input()
  idEntradaAlmacenInput: number = 0;

  
  // @Output() valueChangeTodosIEA = new EventEmitter();

  isumosentradaalmacen !: AlmacenEntradaInsumosDTO[];
  // todos : boolean = false;

  ngOnInit() {
    // if(this.idEntradaAlmacenInput > 0 && this.idRequisicionInput > 0){
    //   this.todos = true;
    // }
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.isumosentradaalmacen = [];
    this._inusmosEntradaAlmacenService.ObtenXIdEntradaAlmacen(this.idEmpresaInput, this.idEntradaAlmacenInput)
      .subscribe((datos) => {
        this.isumosentradaalmacen = datos;
      });

    // if(this.idProyectoInput > 0 && this.idEntradaAlmacenInput <= 0){
    //   this._inusmosEntradaAlmacenService.ObtenXIdProyecto(this.idEmpresaInput, this.idProyectoInput)
    //     .subscribe((datos) => {
    //       this.isumosentradaalmacen = datos;
    //     });
    // }
    // else{
    //   if (this.idRequisicionInput > 0 && this.idEmpresaInput > 0 && this.idEntradaAlmacenInput <= 0) {
    //     this._inusmosEntradaAlmacenService.ObtenXIdRequisicion(this.idEmpresaInput, this.idRequisicionInput)
    //       .subscribe((datos) => {
    //         this.isumosentradaalmacen = datos;
    //       });
    //   }else{
    //     this._inusmosEntradaAlmacenService.ObtenXIdEntradaAlmacen(this.idEmpresaInput, this.idEntradaAlmacenInput)
    //       .subscribe((datos) => {
    //         this.isumosentradaalmacen = datos;
    //       });
    //   }
    // }
  }


  // verTodos(){
  //   this.valueChangeTodosIEA.emit(0);
  // }




}
