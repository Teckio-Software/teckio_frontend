import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { diasConsideradosDTO, factorSalarioIntegradoDTO, factorSalarioRealDTO, factorSalarioRealDetalleDTO } from '../../fsr/tsFSR';
import { FSRService } from '../../fsr/fsr.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { subscribeOn } from 'rxjs';
import { th } from 'date-fns/locale';
import { EstimacionesService } from '../../estimaciones/estimaciones.service';

@Component({
  selector: 'app-dialog-fsr',
  templateUrl: './dialog-fsr.component.html',
  styleUrls: ['./dialog-fsr.component.css']
})
export class DialogFSRComponent {
  selectedEmpresa: number;
  selectedProyecto: number;

  fsi: factorSalarioIntegradoDTO = {
    id: 0,
    idProyecto: 0,
    fsi: 0
  }
  fsr: factorSalarioRealDTO = {
    id: 0,
    idProyecto: 0,
    porcentajeFsr: 0
  }
  diasNoLaborales: number = 0;
  diasPagados: number = 0;
  fsrDetalles: factorSalarioRealDetalleDTO[] = [];
  diasConsideradosFsiPagados: diasConsideradosDTO[] = [];
  diasConsideradosFsiNoTrabajados: diasConsideradosDTO[] = [];

  porcentajePrestaciones: number = 0;
  existeEdicion : boolean = false;

  existenEstimaciones : boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogFSRComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private fsrService: FSRService,
    private _SeguridadService: SeguridadService,
    private estimacionesService: EstimacionesService,


    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    let Empresa = this._SeguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(Empresa);
    let Proyecto = this._SeguridadService.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(Proyecto);
  }

  ngOnInit(): void {
    this.estimacionesService.obtenerPeriodos(this.selectedProyecto, this.selectedEmpresa).subscribe((datos)=>{
      if(datos.length > 0){
          this.existenEstimaciones = true;
      }
  });
    console.log("datos recibidos dias Considerados No trabajados", this.selectedEmpresa);
    console.log("datos recibidos dias Considerados Pagados", this.diasConsideradosFsiPagados);
    this.ObtenerFS();
    this.calcularDias();
  }

  ObtenerFS() {
    this.fsrService.obtenerFSR(this.selectedProyecto, this.selectedEmpresa).subscribe((datos) => {
      this.fsr = datos;
      console.log("este es el FSR", this.fsr);
      this.fsrService.obtenerFSRDetalles(this.fsr.id, this.selectedEmpresa).subscribe((datos) => {
        this.fsrDetalles = datos;
        console.log("estos son los det FSR", this.fsrDetalles);
        this.fsrDetalles.push({
          id: 0,
          idFactorSalarioReal: 0,
          codigo: '',
          descripcion: '',
          porcentajeFsrdetalle: 0,
          articulosLey: '',
          idProyecto: this.selectedProyecto
        });
        this.calcularDias();
      });
    });
    this.fsrService.obtenerFSI(this.selectedProyecto, this.selectedEmpresa).subscribe((datos) => {
      this.fsi = datos;
      console.log("este es el FSI", this.fsi);
      this.fsrService.obtenerDiasNoLaborables(this.fsi.id, this.selectedEmpresa).subscribe((datos) => {
        this.diasConsideradosFsiNoTrabajados = datos;
        console.log("estos son los det FSI no Laborales", this.diasConsideradosFsiNoTrabajados);
        this.diasConsideradosFsiNoTrabajados.push({
          id: 0,
          codigo: '',
          descripcion: '',
          valor: 0,
          articulosLey: '',
          esLaborableOPagado: false,
          idFactorSalarioIntegrado: 0,
          idProyecto: this.selectedProyecto
        });
        this.calcularDias();
      });
      this.fsrService.obtenerDiasPagados(this.fsi.id, this.selectedEmpresa).subscribe((datos) => {
        this.diasConsideradosFsiPagados = datos;
        console.log("estos son los det FSI Pagados", this.diasConsideradosFsiPagados);
        this.diasConsideradosFsiPagados.push({
          id: 0,
          codigo: '',
          descripcion: '',
          valor: 0,
          articulosLey: '',
          esLaborableOPagado: true,
          idFactorSalarioIntegrado: 0,
          idProyecto: this.selectedProyecto
        });
        this.calcularDias();
      });
    });
  }

  calcularDias() {
    console.log("aqui ando");
    this.porcentajePrestaciones = 0;
    this.diasPagados = 0;
    this.diasNoLaborales = 0;
    this.fsrDetalles.forEach((element) => {
      this.porcentajePrestaciones += element.porcentajeFsrdetalle;
    });
    this.diasConsideradosFsiNoTrabajados.forEach((element) => {
      this.diasNoLaborales += element.valor;
    });
    this.diasConsideradosFsiPagados.forEach((element) => {
      this.diasPagados += element.valor;
    });
  }

  crearFSIDias(dias: diasConsideradosDTO) {
    if (typeof dias.codigo == undefined || !dias.codigo || dias.codigo == "" ||
      typeof dias.descripcion == undefined || !dias.descripcion || dias.descripcion == "" ||
      typeof dias.valor == undefined || !dias.valor
    ) {
      this._snackBar.open("capture todos los campos", "X", { duration: 3000 });
      return;
    }
    this.existeEdicion = true;
    if(dias.id <= 0){
      this.fsrService.crearDiasFSI(dias, this.selectedEmpresa)
      .subscribe(() => {
        this.ObtenerFS();
        this.calcularDias();
      })
    }else{
      this.fsrService.editarDiasFSI(dias, this.selectedEmpresa).subscribe(() =>{
        this.ObtenerFS();
        this.calcularDias();
      });
    }
    
  }



  crearFSRDetalle(fsrDetalle: factorSalarioRealDetalleDTO) {
    if (typeof fsrDetalle.codigo == undefined || !fsrDetalle.codigo || fsrDetalle.codigo == "" ||
      typeof fsrDetalle.descripcion == undefined || !fsrDetalle.descripcion || fsrDetalle.descripcion == "" ||
      typeof fsrDetalle.porcentajeFsrdetalle == undefined || !fsrDetalle.porcentajeFsrdetalle
    ) {
      this._snackBar.open("capture todos los campos", "X", { duration: 3000 });
      return;
    }
    this.existeEdicion = true;
    if(fsrDetalle.id <= 0){
      this.fsrService.crearDetalleFSR(fsrDetalle, this.selectedEmpresa)
      .subscribe(() => {
        this.ObtenerFS();
        this.calcularDias();
      })
    }else{
      this.fsrService.editarDetalleFSR(fsrDetalle, this.selectedEmpresa).subscribe(() =>{
        this.ObtenerFS();
        this.calcularDias();
      });
    }
    
  }

  EliminarDetFSI(dias: diasConsideradosDTO){
    this.existeEdicion = true;
    this.fsrService.eliminarDetalleFSI(dias.id, this.selectedEmpresa).subscribe(() =>{
      this.ObtenerFS();
      this.calcularDias();
    });
  }

  EliminarDetFSR(fsrDetalle: factorSalarioRealDetalleDTO){
    this.existeEdicion = true;
    this.fsrService.eliminarDetalleFSR(fsrDetalle.id, this.selectedEmpresa).subscribe(() =>{
      this.ObtenerFS();
      this.calcularDias();
    });
  }

  cerrarDialog() {
    this.dialogRef.close(this.existeEdicion); // Cierra el modal sin guardar
  }

  detenerCierre(event: MouseEvent) {
    console.log("afuera");
    event.stopPropagation();
  }

}
