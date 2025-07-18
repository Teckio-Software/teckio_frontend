import { Component, TemplateRef, ViewChild } from '@angular/core';
import { almacenSalidaCreacionDTO, almacenSalidaDTO, insumosExistenciaDTO } from '../tsAlmacenSalida';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { almacenSalidaInsumosCreacionDTO, almacenSalidaInsumosDTO, insumoXSalidaSeleccionDTO } from '../../almacenSalidaInsumos/tsAlmacenSalidaInsumos';
import { almacenDTO } from '../../almacen/almacen';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AlmacenService } from '../../almacen/almacen.service';
import { RequisicionService } from 'src/app/compras/requisicion/requisicion.service';
import { AlmacenSalidaService } from '../almacen-salida.service';
import { AlmacenSalidaInsumosService } from '../../almacenSalidaInsumos/almacen-salida-insumos.service';
import { MatSelectChange } from '@angular/material/select';
import { PageEvent } from '@angular/material/paginator';
import { HttpResponse } from '@angular/common/http';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { InsumoDTO } from 'src/app/catalogos/insumo/tsInsumo';
import { MatTable } from '@angular/material/table';
import { ExistenciasService } from '../../existencia/existencias.service';
import { existenciasInsumosDTO } from '../../existencia/tsExistencia';
import { Observable, elementAt, map, startWith } from 'rxjs';
import { InsumoService } from 'src/app/catalogos/insumo/insumo.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-almacen-salida',
  templateUrl: './almacen-salida.component.html',
  styleUrls: ['./almacen-salida.component.css']
})
export class AlmacenSalidaComponent {
  states = [
    { name: 'Arizona', abbrev: 1 },
    { name: 'California', abbrev: 2 },
    { name: 'Colorado', abbrev: 3 },
    { name: 'New York', abbrev: 4 },
    { name: 'Pennsylvania', abbrev: 5 },
  ];


  @ViewChild('dialogNuevaSalida', { static: true })
  dialogNuevaSalidaAlmacen!: TemplateRef<any>;
  idSalidaAlmacen: number = 0;
  selectedRow: number = 0;
  tieneInsumosXAlmacenSalida: boolean = false;


  idAlmacen: number = 0;
  idContratista: number = 0;
  idProyecto: number = 0;
  selectedIndex: number = 0;
  appRegarga: number = 1;
  appRegarga2: number = 1;

  proyectos!: proyectoDTO[];
  salidasAlmancen!: almacenSalidaCreacionDTO[];
  almacenes!: almacenDTO[];
  insumosDisponibles !: insumosExistenciaDTO[];
  insumosAgregados: insumosExistenciaDTO[] = [];

  almacenSalidaCreacion: almacenSalidaCreacionDTO = {
    personaRecibio: '',
    ListaAlmacenSalidaInsumoCreacion: [],
    idAlmacen: 0,
    observaciones: '',
    esBaja: false
  }

  nombreUsuario : string = "";

  insumosAlmacenSalida: almacenSalidaInsumosCreacionDTO[] = [];
  selectedEmpresa = 0;
  proyectoSeleccionado !: boolean;
  salidaseleccionada !: boolean;
  form!: FormGroup;
  constructor(
    private proyectoService: ProyectoService

    , private _snackBar: MatSnackBar
    , private FormBuilder: FormBuilder
    , private dialog: MatDialog
    , private insumoService: InsumoService
    , private almacenService: AlmacenService
    , private _SeguridadEmpresa: SeguridadService
    , private _almacenSalida: AlmacenSalidaService) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
    this.nombreUsuario = _SeguridadEmpresa.zfObtenerCampoJwt('username');
    this.selectedEmpresa = Number(idEmpresa);
    this.idProyecto = Number(idProyecto);
    this.proyectoSeleccionado = false;
  }

  ngOnInit() {
    this.traerInformacion();
    this.proyectoService.obtener(this.selectedEmpresa).subscribe((datos) => {
      this.proyectos = datos;
    })
    this.form = this.FormBuilder.group({
      almacen: ['', { validators: [], },] 
      , observaciones: ['', { validators: [], },]
      , personaRecibe: ['', { validators: [], },]
      , esBaja: [false,{ validators: [], },]

    });

    

  }

  traerInformacion(
  ) {
    


    this.proyectoSeleccionado = true;

    this.almacenes = [];

    this.appRegarga2 = this.appRegarga2 + 1;

    this.almacenService.obtenerXIdProyecto(this.idProyecto, this.selectedEmpresa).subscribe((datos) => {
      this.almacenes = datos;
    })

    this.insumosDisponibles = [];
    this.insumosAgregados = [];

  }
  cargarInsumo(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const idInsumo = this.insumosDisponibles.find(insumo => insumo.descripcion === selectedValue)?.idInsumo || 0;

    this.insumosDisponibles.forEach(element => {
      if (element.idInsumo == idInsumo) {
        this.insumosAgregados.push({
          idInsumo: element.idInsumo,
          codigo: element.codigo,
          descripcion: element.descripcion,
          unidad: element.unidad,
          cantidadDisponible: element.cantidadDisponible,
          esPrestamo: false,
          cantidadPorSalir: 0
        });
      }
    });
    var filtrarObjeto = this.insumosDisponibles.findIndex(z => z.idInsumo == idInsumo);
    if (filtrarObjeto > -1) {
      this.insumosDisponibles.splice(filtrarObjeto, 1);
    }
  }

  onAlmacenSelectionChange(event: any) {
    const value = event.target.value;
    const valores = value.split(":");
    const segundoValor = Number.parseInt(valores[1]);
    this.idAlmacen = segundoValor;
    this._almacenSalida.obtenerInsumosDisponibles(this.selectedEmpresa, this.idAlmacen).subscribe((datos) => {
      this.insumosDisponibles = datos;
    });
  }

  openDialogWithoutRef() {
    this.dialog.open(this.dialogNuevaSalidaAlmacen, {
      width: '50%',
      disableClose: true
    });
  }

  guardarNuevaSalida() {
    if (this.form.get("almacen")?.value == "" || this.form.get("personaRecibe")?.value == "" || this.form.get("observaciones")?.value == "" || this.insumosAgregados.length <= 0) {
      Swal.fire({

        title: "Error",
        text: "Capture la información correctamente",
        icon: "error"
      });
      return;
    } else {
      this.almacenSalidaCreacion.idAlmacen = this.form.get("almacen")?.value;
      this.almacenSalidaCreacion.observaciones = this.form.get("observaciones")?.value;
      this.almacenSalidaCreacion.personaRecibio = this.form.get("personaRecibe")?.value;
      if(this.almacenSalidaCreacion.esBaja == null){
        this.almacenSalidaCreacion.esBaja = false;
      }
      console.log(this.almacenSalidaCreacion)
      this.insumosAgregados.forEach(element => {
        if (element.cantidadPorSalir <= 0 || element.cantidadPorSalir > element.cantidadDisponible) {
          Swal.fire({
            title: "Error",
            text: "Capture las cantidades correctamente",
            icon: "error"
          });
          return;
        }
      });
      this.insumosAgregados.forEach(element => {
        this.almacenSalidaCreacion.ListaAlmacenSalidaInsumoCreacion.push({
          idInsumo: element.idInsumo,
          cantidadPorSalir: element.cantidadPorSalir,
          esPrestamo: this.almacenSalidaCreacion.esBaja == true ? false : element.esPrestamo,
          idSalidaAlmacen: 0
        })
      });
      this._almacenSalida.CrearAlmacenSalida(this.selectedEmpresa, this.almacenSalidaCreacion).subscribe((datos) => {
        if (datos.estatus) {
          this.limpiarFormularioNuevaSalida();
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

  EliminarListaInsumosAgragados(idInsumo: number) {
    this.insumosAgregados.forEach(element => {
      if (element.idInsumo == idInsumo) {
        this.insumosDisponibles.push({
          idInsumo: element.idInsumo,
          codigo: element.codigo,
          descripcion: element.descripcion,
          unidad: element.unidad,
          cantidadDisponible: element.cantidadDisponible,
          esPrestamo: false,
          cantidadPorSalir: 0
        });
      }
    });
    var filtrarObjeto = this.insumosAgregados.findIndex(z => z.idInsumo == idInsumo);
    if (filtrarObjeto > -1) {
      this.insumosAgregados.splice(filtrarObjeto, 1);
    }
  }
  limpiarFormularioNuevaSalida() {
    this.form.reset();
    this.almacenSalidaCreacion.ListaAlmacenSalidaInsumoCreacion = [];
    this.insumosDisponibles = [];
    this.insumosAgregados = [];
    this.appRegarga2 += 1;
    this.dialog.closeAll();
  }

  yourFn(event: any) {
    this.selectedIndex = event.index;
  }

  insumosSalidaAlmacen(idSalidaAlmacen: number) {
    this.idSalidaAlmacen = idSalidaAlmacen;
    this.salidaseleccionada = true;
    this.appRegarga = this.appRegarga + 1;
  }

  // removerValoresIdEAparaISA(nuevoValor:number){
  //   this.idSalidaAlmacen = nuevoValor;
  //   this.appRegarga = this.appRegarga + 1;
  //   this.selectedIndex = 1;
  // }


  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
  onEsBajaChange(event: any) {
    if(this.almacenSalidaCreacion.esBaja){
      this.form.get("personaRecibe")?.disable();
      this.form.get("personaRecibe")?.setValue(this.nombreUsuario);
    }else{
      this.form.get("personaRecibe")?.enable();
      this.form.get("personaRecibe")?.setValue("");
    }
  }

  recargaInsumos(event : Event){
    this.appRegarga = this.appRegarga + 1;
  }

}

