import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InsumoService } from 'src/app/catalogos/insumo/insumo.service';
import { AlmacenService } from '../../almacen/almacen.service';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { ComprasdirectasService } from 'src/app/compras/compras/comprasdirectas.service';
import { RequisicionService } from 'src/app/compras/requisicion/requisicion.service';
import { AlmacenEntradaCreacionDTO, AlmacenEntradaDTO } from '../tsAlmacenEntrada';
import { PageEvent } from '@angular/material/paginator';
import { AlmacenEntradaInsumoCreacionDTO, AlmacenEntradaInsumosDTO, InsumoAlmacenEntradaDTO } from '../../almacenEntradaInsumo/tsAlmacenEntradaInsumo';
import { HttpResponse } from '@angular/common/http';
import { AlmacenEntradaService } from '../almacen-entrada.service';
import { AlmacenEntradaInsumoService } from '../../almacenEntradaInsumo/almacen-entrada-insumo.service';
import { almacenDTO } from '../../almacen/almacen';
import { MatSelectChange } from '@angular/material/select';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { ComprasDirectasContratistaService } from 'src/app/compras/insumosCompradosXContratista/compras-directas-contratista.service';
import { InsumoCompraDirectaContratistaDTO } from 'src/app/compras/insumosCompradosXContratista/tsInsumosCompradosXContratista';
import { CotizacionService } from 'src/app/compras/cotizacion/cotizacion.service';
import { cotizacionDTO } from 'src/app/compras/cotizacion/tsCotizacion';
import { InsumosXordenCompraComponent } from 'src/app/compras/orden-compra/insumos-xorden-compra/insumos-xorden-compra.component';
import { insumoXOrdenCompraDTO } from 'src/app/compras/insumoxordencompra/tsInsumoXOrdenCompra';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { InsumoXOrdenCompraService } from 'src/app/compras/insumoxordencompra/insumoxordencompra.service';
import Swal from 'sweetalert2';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import { AjusteEntradaAlmacenComponent } from '../ajuste-entrada-almacen/ajuste-entrada-almacen.component';
import { DevolucionPrestamosComponent } from '../devolucion-prestamos/devolucion-prestamos.component';

@Component({
  selector: 'app-almacen-entrada',
  templateUrl: './almacen-entrada.component.html',
  styleUrls: ['./almacen-entrada.component.css']
})
export class AlmacenEntradaComponent implements OnInit {
  @ViewChild('dialogNuevaEntrada', { static: true })
  dialogNuevaCompraDirecta!: TemplateRef<any>;
  idEntradaAlmacen: number = 0;
  selectedRow: number = 0;
  tieneInsumosXAlmacenEntrada: boolean = false;
  formNuevaEntrada!: FormGroup;


  idAlmacen: number = 0;
  idContratista: number = 0;
  idProyecto: number = 0;
  selectedIndex: number = 0;
  appRegarga: number = 1;
  appRecarga2: number = 0;

  proyectos!: proyectoDTO[];
  entradasAlmacenInsumos!: AlmacenEntradaInsumosDTO[];
  almacenes!: almacenDTO[];
  contratistas!: contratistaDTO[];
  insumosCompradosContratista!: insumoXOrdenCompraDTO[];
  inusmosAlmacenEntradaCreacion !: AlmacenEntradaCreacionDTO[];

  almacenEntradaCreacion: AlmacenEntradaCreacionDTO = {
    idAlmacen: 0,
    idContratista: 0,
    listaInsumosEnAlmacenEntrada: [],
    observaciones: ''
  }

  insumosAlmacenEntradaAlmacen: AlmacenEntradaInsumoCreacionDTO = {
    idInsumo: 0,
    cantidadPorRecibir: 0,
    cantidadRecibida: 0,
    idOrdenCompra: 0,
    idInsumoXOrdenCompra: 0,
    descripcion: '',
    unidad: '',
    idTipoInsumo: 0,
    idAlmacenEntrada: 0
  }
  cotizacion !: cotizacionDTO;
  selectedEmpresa = 0;
  // idPryecto = 0;
  proyectoSeleccionado !: boolean;
  entradaseleccionada !: boolean;
  form!: FormGroup;

  tiposEntradaAlmacen !: number;
  constructor(private compraDirectaService: ComprasdirectasService
    , private proyectoService: ProyectoService

    , private _snackBar: MatSnackBar
    , private FormBuilder: FormBuilder
    , private dialog: MatDialog
    , private insumoService: InsumoService
    , private almacenService: AlmacenService
    , private contratistaService: ContratistaService
    , private insumoXordenCompraServide: InsumoXOrdenCompraService
    , private _SeguridadEmpresa: SeguridadService
    , private _AlmacenEntradaService: AlmacenEntradaService) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    this.idProyecto = Number(idProyecto);
    this.proyectoSeleccionado = false;
  }

  ngOnInit() {
    
   this.traerInformacion();
    this.form = this.FormBuilder.group({
      almacen: ['', { validators: [], },]
      , observaciones: ['', { validators: [], },]
      , contratista: ['', { validators: [], },]
    });
    this.contratistaService.obtenerTodos(this.selectedEmpresa)
      .subscribe((respuesta) => {
        this.contratistas = respuesta;
    });
  }

  traerInformacion(
  ) {


    this.proyectoSeleccionado = false;

    this.almacenService.obtenerXIdProyecto(this.idProyecto, this.selectedEmpresa).subscribe((datos) => {
      this.proyectoSeleccionado = true;
      this.almacenes = datos;
      this.appRegarga = this.appRegarga + 1;
    })
  }

  // onAlmacenSelectionChange(event: MatSelectChange) {
  //   this.idAlmacen = event.value;
  // }
  onAlmacenSelectionChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const idAlmacen = this.almacenes.find(almacen => almacen.almacenNombre === selectedValue)?.id || 0;
    this.idAlmacen = idAlmacen;
  }

  // onContratistaSelectionChange(event: MatSelectChange ) {
  //   // const inputElement = event.target as HTMLInputElement;
  //   // const selectedValue = inputElement.value;
  //   // const idContratist = this.contratistas.find(con => con.razonSocial === selectedValue)?.id || 0;
    
  //   this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada = [];
  //   this.idContratista = event.value;

  //   this.insumoXordenCompraServide.obtenerXIdContratista(this.selectedEmpresa, this.idContratista).subscribe((datos) => {
  //     this.insumosCompradosContratista = datos;
  //     this.insumosCompradosContratista.forEach((element) => {
  //       element.cantidadRecibida = 0;
  //     })
  //   });
  // }

  onContratistaSelectionChange(event: Event ) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const idContratist = this.contratistas.find(con => con.razonSocial === selectedValue)?.id || 0;
    
    this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada = [];
    this.idContratista = idContratist;

    this.insumoXordenCompraServide.obtenerXIdContratista(this.selectedEmpresa, this.idContratista, this.idProyecto).subscribe((datos) => {
      this.insumosCompradosContratista = datos;
      this.insumosCompradosContratista.forEach((element) => {
        element.cantidadRecibida = 0;
      })
    });
  }

  openDialogWithoutRef() {
    this.dialog.open(this.dialogNuevaCompraDirecta, {
      width: '50%',
      disableClose: true
    });
  }
  openDialogWithoutRefAjuste(): void {
    const dialogRef = this.dialog.open(AjusteEntradaAlmacenComponent);
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      this.appRegarga += 1;
    });
  
  }

  openDialogWithoutRefDevolucion(){
    const dialogRef = this.dialog.open(DevolucionPrestamosComponent);
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      this.appRegarga += 1;
    });
  }

  guardarNuevaEntrada() {
    this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada = [];
    this.almacenEntradaCreacion.idAlmacen = this.form.get('almacen')?.value;
    this.almacenEntradaCreacion.idContratista = this.idContratista;
    this.almacenEntradaCreacion.observaciones = this.form.get('observaciones')?.value;

    this.insumosCompradosContratista.forEach((element) => {
      this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada.push({
        idInsumo: element.idInsumo,
        cantidadPorRecibir: element.cantidad,
        cantidadRecibida: element.cantidadRecibida,
        idOrdenCompra: element.idOrdenCompra,
        idInsumoXOrdenCompra: element.id,
        descripcion: '',
        unidad: '',
        idTipoInsumo: 0,
        idAlmacenEntrada: 0
      });
    });

    if (this.almacenEntradaCreacion.idAlmacen <= 0 || this.almacenEntradaCreacion.idContratista <= 0 ||
      this.almacenEntradaCreacion.observaciones == "" || this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada.length <= 0
    ) {
      Swal.fire({
        title: "Error",
        text: "Capture la información correctamente",
        icon: "error"
      });
    } else {
      this._AlmacenEntradaService.crear(this.selectedEmpresa, this.almacenEntradaCreacion).subscribe((datos) => {
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

  EliminarListaInsumosXCotizacion(descripcion: string, unidad: string) {
    if (this.insumosCompradosContratista.length > 1) {
      var filtrarObjeto = this.insumosCompradosContratista.findIndex(z => z.descripcion == descripcion && z.unidad == unidad);
      if (filtrarObjeto > -1) {
        this.insumosCompradosContratista.splice(filtrarObjeto, 1);
      }
    }
  }
  limpiarFormularioNuevaEntrada() {
    this.form.reset();
    this.insumosCompradosContratista = [];
    this.appRegarga += 1;
    this.dialog.closeAll();
  }

  // yourFn(event: any) {
  //   this.selectedIndex = event.index;
  // }

  insumosEntradaAlmacen(idEntradaAlmacen:number){
    this.idEntradaAlmacen = idEntradaAlmacen;
    this.entradaseleccionada =  true;
    this.appRecarga2 = this.appRecarga2 + 1;
  }

  removerValoresIdEAparaIEA(nuevoValor:number){
    this.idEntradaAlmacen = nuevoValor;
    //this.appRegarga = this.appRegarga + 1;
    this.selectedIndex = 1;
  }
 

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }


}
