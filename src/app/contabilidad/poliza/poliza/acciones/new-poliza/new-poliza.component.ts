import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { polizaDTO, PolizaFolioCodigoDTO } from '../../../tsPoliza';
import { PolizaService } from '../../../poliza.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { tipoPolizaDTO } from 'src/app/contabilidad/tipos-polizas/tsTipoPoliza';
import { polizaDetalleDTO } from 'src/app/contabilidad/poliza-detalle/tsPolizaDetalle';
import { cuentaContableDTO } from 'src/app/contabilidad/cuenta-contable/tsCuentaContable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoPolizaService } from 'src/app/contabilidad/tipos-polizas/tipo-poliza.service';
import { CuentaContableService } from 'src/app/contabilidad/cuenta-contable/cuenta-contable.service';

@Component({
  selector: 'app-new-poliza',
  templateUrl: './new-poliza.component.html',
  styleUrls: ['./new-poliza.component.css']
})
export class NewPolizaComponent {

  form!: FormGroup;
  polizaObtencionFolio: polizaDTO = {
    id: 0,
    idTipoPoliza: 0,
    folio: '',
    numeroPoliza: '',
    fechaAlta: new Date(),
    fechaPoliza: new Date(),
    concepto: '',
    estatus: 0,
    observaciones: '',
    origenDePoliza: 0,
    esPolizaCierre: false,
    detalles: []
}
folioYNumeroPoliza: PolizaFolioCodigoDTO = {
  folio: '',
  numeroPoliza: ''
}
folio: string = "";
numeroPoliza: string = "";
selectedEmpresa: number = 0;
tiposPolizas!: tipoPolizaDTO[];
polizasDetallesCreacion: polizaDetalleDTO[] = [];
cuentasContables!: cuentaContableDTO[];
totalHaberCreacion: number = 0;
totalDebeCreacion: number = 0;
polizaCreacion: polizaDTO = {
  id: 0,
  idTipoPoliza: 0,
  folio: '',
  numeroPoliza: '',
  fechaAlta: new Date(),
  fechaPoliza: new Date(),
  concepto: '',
  estatus: 0,
  observaciones: '',
  origenDePoliza: 0,
  esPolizaCierre: false,
  detalles: []
}

selectedPoliza: number = 0;
    fechaAlta: string = new Date().toLocaleDateString('en-GB');
    totalHaber: number = 0;
    totalDebe: number = 0;








  constructor(
    private dialogRef: MatDialogRef<NewPolizaComponent>
    ,private polizaService: PolizaService
    , private _SeguridadEmpresa: SeguridadService
    , private _snackBar: MatSnackBar
    , private tipoPolizaService: TipoPolizaService
    , private formBuilder: FormBuilder
    , private cuentaContableService: CuentaContableService





  ) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
   }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [0, {validators: [],},]
      , idTipoPoliza: ['', {validators: [],},]
      , folio: [this.folio, {validators: [], },]
      , numeroPoliza: [this.numeroPoliza, {validators: [],},]
      , fechaAlta: [this.fechaAlta, {validators: [],},]
      , fechaPoliza: ['', {validators: [],},]
      , concepto: ['', {validators: [],},]
      , estatus: ['', {validators: [],},]
      , observaciones: ['', {validators: [],},]
      , origenDePoliza: ['', {validators: [],},]
      , esPolizaCierre: ['', {validators: [],},]
    })
    this.form.controls['folio'].disable();
    this.form.controls['numeroPoliza'].disable();
    this.form.controls['fechaAlta'].disable();
    this.tipoPolizaService.obtenerTodosSinPaginar(this.selectedEmpresa)
    .subscribe((tiposPolizas) =>{
      console.log(tiposPolizas);
        this.tiposPolizas = tiposPolizas;
    })
    this.polizasDetallesCreacion.push({
      id: 0,
      idPoliza: 0,
      idCuentaContable: 0,
      concepto: '',
      debe: 0,
      haber: 0,
      cuentaContableCodigo: ''
    });
    this.cuentaContableService.obtenerAsignables(this.selectedEmpresa)
    .subscribe((cuentasContables) =>{
      this.cuentasContables = cuentasContables;
    })
  }

  cerrar() {
    this.dialogRef.close(false); // Cierra el diálogo y pasa false para indicar que se canceló la operación
  }

  obtenerFolio(){
    this.polizaObtencionFolio.fechaPoliza = this.form.value['fechaPoliza'];
    this.polizaObtencionFolio.idTipoPoliza = this.form.value['idTipoPoliza'];
    if( typeof this.polizaObtencionFolio.fechaPoliza === 'undefined' || !this.polizaObtencionFolio.fechaPoliza || this.polizaObtencionFolio.fechaPoliza.toString() === "" ||
        typeof this.polizaObtencionFolio.idTipoPoliza === 'undefined' || !this.polizaObtencionFolio.idTipoPoliza || this.polizaObtencionFolio.idTipoPoliza < 0){
            return;
        }
    this.polizaService.obtenerFolioNumeroPoliza(this.polizaObtencionFolio, this.selectedEmpresa)
    .subscribe((folioYNumeroPoliza) => {
        this.folioYNumeroPoliza = folioYNumeroPoliza;
        this.folio = this.folioYNumeroPoliza.folio;
        this.numeroPoliza = this.folioYNumeroPoliza.numeroPoliza;
        this.form.controls['folio'].patchValue(this.folio)
        this.form.controls['numeroPoliza'].patchValue(this.numeroPoliza)
    })
}


agregarDetalle(polizaDetalle: polizaDetalleDTO){
  if( typeof polizaDetalle.concepto === 'undefined' || !polizaDetalle.concepto || polizaDetalle.concepto === "" ||
      (polizaDetalle.debe != 0 && polizaDetalle.haber != 0) || (polizaDetalle.debe <= 0 && polizaDetalle.haber <= 0) ||
      typeof polizaDetalle.idCuentaContable === 'undefined' || !polizaDetalle.idCuentaContable || polizaDetalle.idCuentaContable < 0)
      {
          this._snackBar.open("Capture correctamente los datos", "X", {duration: 3000});
          return;
      }
  if( this.polizasDetallesCreacion[this.polizasDetallesCreacion.length - 1].concepto === "" &&  this.polizasDetallesCreacion[this.polizasDetallesCreacion.length - 1].idCuentaContable === 0 ||
      (this.polizasDetallesCreacion[this.polizasDetallesCreacion.length - 1].debe <= 0 && this.polizasDetallesCreacion[this.polizasDetallesCreacion.length - 1].haber <= 0) ||
      (this.polizasDetallesCreacion[this.polizasDetallesCreacion.length - 1].debe != 0 && this.polizasDetallesCreacion[this.polizasDetallesCreacion.length - 1].haber != 0)){
      return;
  }
  else{
      this.polizasDetallesCreacion.push({
          id: 0,
          idPoliza: 0,
          idCuentaContable: 0,
          concepto: '',
          debe: 0,
          haber: 0,
          cuentaContableCodigo: ''
      });
  }
  this.totalDebeCreacion = 0;
  this.totalHaberCreacion = 0
  this.polizasDetallesCreacion.forEach(detalle => {
      this.totalDebeCreacion = (Number(this.totalDebeCreacion) + Number(detalle.debe));
      this.totalHaberCreacion = (Number(this.totalHaberCreacion) + Number(detalle.haber));
  });
}


reiniciaHaber(polizaDetalle: polizaDetalleDTO){
  this.totalDebeCreacion = 0;
  this.totalHaberCreacion = 0
  polizaDetalle.haber = 0;
  this.polizasDetallesCreacion.forEach(detalle => {
      this.totalDebeCreacion = (Number(this.totalDebeCreacion) + Number(detalle.debe));
      this.totalHaberCreacion = (Number(this.totalHaberCreacion) + Number(detalle.haber));
  });
}

reiniciaDebe(polizaDetalle: polizaDetalleDTO){
  this.totalDebeCreacion = 0;
  this.totalHaberCreacion = 0
  polizaDetalle.debe = 0;
  this.polizasDetallesCreacion.forEach(detalle => {
      this.totalDebeCreacion = (Number(this.totalDebeCreacion) + Number(detalle.debe));
      this.totalHaberCreacion = (Number(this.totalHaberCreacion) + Number(detalle.haber));
  });
}


guardar(){
  this.form.controls['numeroPoliza'].enable();
  this.form.controls['fechaAlta'].enable();
  this.form.controls['folio'].enable();
  this.polizaCreacion = this.form.value;
  this.polizaCreacion.fechaAlta = new Date();
  this.form.controls['numeroPoliza'].disable();
  this.form.controls['fechaAlta'].disable();
  this.form.controls['folio'].disable();
  this.polizaCreacion.estatus = 1;
  this.polizaCreacion.origenDePoliza = 1;
  this.polizaCreacion.esPolizaCierre = false;
  this.polizaCreacion.detalles = this.polizasDetallesCreacion;
  if( typeof this.polizaCreacion.folio === 'undefined' || !this.polizaCreacion.folio || this.polizaCreacion.folio === "" ||
      typeof this.polizaCreacion.numeroPoliza === 'undefined' || !this.polizaCreacion.numeroPoliza || this.polizaCreacion.numeroPoliza === "" ||
      typeof this.polizaCreacion.fechaAlta === 'undefined' || !this.polizaCreacion.fechaAlta ||
      typeof this.polizaCreacion.fechaPoliza === 'undefined' || !this.polizaCreacion.fechaPoliza ||
      typeof this.polizaCreacion.concepto === 'undefined' || !this.polizaCreacion.concepto || this.polizaCreacion.concepto === "" ||
      typeof this.polizaCreacion.estatus === 'undefined' || !this.polizaCreacion.estatus || this.polizaCreacion.estatus <= 0 ||
      typeof this.polizaCreacion.origenDePoliza === 'undefined' || !this.polizaCreacion.origenDePoliza || this.polizaCreacion.origenDePoliza <= 0
      )
      {
          this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
          return;
      }
  if(this.totalDebeCreacion !== this.totalHaberCreacion){
      this._snackBar.open("La póliza no cuadra", "X", {duration: 3000});
      return;
  }
  if (this.polizaCreacion.id > 0){
      this.polizaService.editar(this.polizaCreacion, this.selectedEmpresa)
      .subscribe({
          next: () =>{
              this.dialogRef.close(true);
              // if (this.tieneDetalle){
              //     this.cargarRegistrosDetalles(this.selectedPoliza);
              // }
          },
          error: (zError: any) =>{
              console.error(zError)
          }
      });
  }else{
      this.polizaService.crear(this.polizaCreacion, this.selectedEmpresa)
      .subscribe({
          next: () =>{
              this.dialogRef.close(true);
          },
          error: (zError: any) =>{
              console.error(zError)
          }
      })
  }
  this.form.reset();
  this.polizasDetallesCreacion = [];
  this.polizasDetallesCreacion.push({
      id: 0,
      idPoliza: 0,
      idCuentaContable: 0,
      concepto: '',
      debe: 0,
      haber: 0,
      cuentaContableCodigo: ''
  });
  this.polizaCreacion.fechaAlta = new Date(this.form.value['fechaAlta']);
}


  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

}
