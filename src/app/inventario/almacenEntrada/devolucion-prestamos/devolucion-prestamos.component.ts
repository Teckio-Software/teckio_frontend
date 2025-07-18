import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlmacenService } from '../../almacen/almacen.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { AlmacenEntradaService } from '../almacen-entrada.service';
import { TipoInsumoService } from 'src/app/catalogos/tipo-insumo/tipo-insumo.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { almacenDTO } from '../../almacen/almacen';
import { tipoInsumoDTO } from 'src/app/catalogos/tipo-insumo/tsTipoInsumo';
import { AlmacenEntradaCreacionDTO, AlmacenEntradaDevolucionCreacionDTO } from '../tsAlmacenEntrada';
import { almacenSalidaInsumosDTO } from '../../almacenSalidaInsumos/tsAlmacenSalidaInsumos';
import { AlmacenSalidaInsumosService } from '../../almacenSalidaInsumos/almacen-salida-insumos.service';
import Swal from 'sweetalert2';
import { AlmacenEntradaInsumoCreacionDTO, AlmacenEntradaInsumosDTO } from '../../almacenEntradaInsumo/tsAlmacenEntradaInsumo';

@Component({
  selector: 'app-devolucion-prestamos',
  templateUrl: './devolucion-prestamos.component.html',
  styleUrls: ['./devolucion-prestamos.component.css']
})
export class DevolucionPrestamosComponent {

  formNuevaEntrada!: FormGroup;
  form!: FormGroup;
  idProyecto: number = 0;
  appRegarga: number = 1;
  almacenes!: almacenDTO[];
  tipoInsumos !: tipoInsumoDTO[];
  insumossalidaalmacen !: almacenSalidaInsumosDTO[];
  selectedEmpresa : number = 0;
  idAlmacen : number = 0;
  insumosDevolucionEntradaAlmacen : AlmacenEntradaInsumoCreacionDTO[] = [];
  almacenEntradaCreacion: AlmacenEntradaDevolucionCreacionDTO = {
    idAlmacen: 0,
    idContratista: 0,
    listaInsumosPrestamo: [],
    observaciones: ''
  }

  @ViewChild('dialogDevolucionPrestamos', { static: true }) dialogNuevaEntradaAlmacenDevolucion!: TemplateRef<any>;
  constructor(
    private FormBuilder: FormBuilder,
    private dialog: MatDialog,
    private _tipoInsumo : TipoInsumoService,
    private almacenService: AlmacenService,
    private _SeguridadEmpresa: SeguridadService,
    private _AlmacenEntradaService: AlmacenEntradaService,
    private _inusmosSalidaAlmacenService : AlmacenSalidaInsumosService
  ) { 
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
    this.idProyecto = Number(idProyecto);
  }

  ngOnInit() {
    this.dialog.open(this.dialogNuevaEntradaAlmacenDevolucion, {
      width: '50%',
      disableClose: true
    });
    this.form = this.FormBuilder.group({
      almacen: ['', { validators: [], },]
      , observaciones: ['', { validators: [], },]
    });
    this._tipoInsumo.TipoInsumosParaRequisitar(this.selectedEmpresa).subscribe((datos) => {
      this.tipoInsumos = datos;
    });
    this.almacenService.obtenerXIdProyecto(this.idProyecto, this.selectedEmpresa).subscribe((datos) => {
      this.almacenes = datos;
      this.appRegarga = this.appRegarga + 1;
    })
  }

  onAlmacenSelectionChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const idAlmacen = this.almacenes.find(almacen => almacen.almacenNombre === selectedValue)?.id || 0;
    this.idAlmacen = this.form.get('almacen')?.value;
    this._inusmosSalidaAlmacenService.ObtenXIdAlmacenYPrestamo(this.selectedEmpresa, this.idAlmacen).subscribe((datos) => {
      this.insumossalidaalmacen = datos;
    });
  }

  guardarNuevaEntrada(){
    this.almacenEntradaCreacion.idAlmacen = this.form.get('almacen')?.value;
    this.almacenEntradaCreacion.observaciones = this.form.get('observaciones')?.value;

    this.almacenEntradaCreacion.listaInsumosPrestamo = this.insumossalidaalmacen;

    if (this.almacenEntradaCreacion.idAlmacen <= 0 || this.almacenEntradaCreacion.observaciones == "" || this.almacenEntradaCreacion.listaInsumosPrestamo.length <= 0
    ) {
      Swal.fire({
        title: "Error",
        text: "Capture la información correctamente",
        icon: "error"
      });
    }else{
      this._AlmacenEntradaService.CrearDevolucionEntradaAlmacen(this.selectedEmpresa, this.almacenEntradaCreacion).subscribe((datos) => {
        if (datos.estatus) {
          this.limpiarFormularioNuevaEntrada();
          this.dialog.closeAll();
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

  limpiarFormularioNuevaEntrada(){
    this.insumossalidaalmacen = []
    this.almacenEntradaCreacion.listaInsumosPrestamo = [];
    this.form.reset();
    this.dialog.closeAll();
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  EliminarListaInsumos(id : number){
    if (this.insumossalidaalmacen.length > 1) {
      var filtrarObjeto = this.insumossalidaalmacen.findIndex(z => z.id == id);
      if (filtrarObjeto > -1) {
        this.insumossalidaalmacen.splice(filtrarObjeto, 1);
      }
    }
  }

}
