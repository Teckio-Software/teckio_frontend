import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { insumoXOrdenCompraDTO } from '../../insumoxordencompra/tsInsumoXOrdenCompra';
import { InsumoXOrdenCompraService } from '../../insumoxordencompra/insumoxordencompra.service';
import { MatDialog } from '@angular/material/dialog';
import { ImpuestoInsumoOrdenCompraDTO } from '../tsOrdenCompra';

@Component({
  selector: 'app-insumos-xorden-compra',
  templateUrl: './insumos-xorden-compra.component.html',
  styleUrls: ['./insumos-xorden-compra.component.css'],
})
export class InsumosXordenCompraComponent {
  insumosXordencompras: insumoXOrdenCompraDTO[] = [];
  impuestoInsumoOrdenCompra: ImpuestoInsumoOrdenCompraDTO[] = [];
  @ViewChild('dialogImpuestos', { static: true })
  dialogNuevosImpuestos!: TemplateRef<any>;
  constructor(
    public _insumoXOrdenCompraService: InsumoXOrdenCompraService,
    private dialog: MatDialog
  ) {}

  @Input()
  idRequisicionInput: number = 0;
  @Input()
  idEmpresaInput: number = 0;
  @Input()
  idCotizacionInput: number = 0;
  @Input()
  idOrdenCompraInput: number = 0;

  // @Output() valueChangeTodosIOC = new EventEmitter();
  // todos : boolean = false;
  ngOnInit() {
    // if(this.idCotizacionInput > 0 || this.idOrdenCompraInput ){
    //   this.todos = true;
    // }
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.insumosXordencompras = [];
    if (this.idEmpresaInput != 0) {
      if (this.idOrdenCompraInput > 0) {
        this._insumoXOrdenCompraService
          .ObtenXIdOrdenCompra(this.idEmpresaInput, this.idOrdenCompraInput)
          .subscribe((datos) => {
            this.insumosXordencompras = datos;
          });
      }
      // else if (this.idCotizacionInput > 0){
      //   this._insumoXOrdenCompraService.ObtenXIdCotizacion(this.idEmpresaInput, this.idCotizacionInput)
      //     .subscribe((datos) => {
      //       this.insumosXordencompras = datos;
      //     });
      // }else{
      //   this._insumoXOrdenCompraService.ObtenXIdRequisicion(this.idEmpresaInput, this.idRequisicionInput)
      //     .subscribe((datos) => {
      //       this.insumosXordencompras = datos;
      //     });
      // }
    }
  }

  verImpuestos(idInsumoXOC: number) {
    this._insumoXOrdenCompraService
      .ObtenerImpuestosInsumoOrdenCompra(this.idEmpresaInput, idInsumoXOC)
      .subscribe((datos) => {
        this.impuestoInsumoOrdenCompra = datos;
      });
    this.dialog.open(this.dialogNuevosImpuestos, {
      width: '20%',
      disableClose: true,
    });
  }

  desplegarInformacion(ioc: insumoXOrdenCompraDTO) {
    ioc.isExpanded = !ioc.isExpanded;
  }

  limpiarFormularioNuevaEntrada() {
    this.dialog.closeAll();
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  // verTodos(){
  //   this.valueChangeTodosIOC.emit(0);
  // }
}
