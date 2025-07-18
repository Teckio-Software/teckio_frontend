import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { insumoXRequisicionCreacion } from '../../insumos-requicision/insumoxrequisicion/tsInsumoXRequisicion';
import Swal from 'sweetalert2';
import { requisicionCreacionDTO } from '../tsRequisicion';
import { RequisicionService } from '../requisicion.service';
import { InsumoService } from 'src/app/catalogos/insumo/insumo.service';
import { InsumoDTO, InsumoParaExplosionDTO } from 'src/app/catalogos/insumo/tsInsumo';
import { formatDate } from '@angular/common';
import { ExistenciasService } from 'src/app/inventario/existencia/existencias.service';
import { tipoInsumoDTO } from 'src/app/catalogos/tipo-insumo/tsTipoInsumo';
import { TipoInsumoService } from 'src/app/catalogos/tipo-insumo/tipo-insumo.service';
import { PrecioUnitarioService } from 'src/app/proyectos/precio-unitario/precio-unitario.service';

@Component({
  selector: 'app-modal-new-requisicion',
  templateUrl: './modal-new-requisicion.component.html',
  styleUrls: ['./modal-new-requisicion.component.css']
})
export class ModalNewRequisicionComponent {
  @ViewChild('closeModal') closeModal!: ElementRef


  form!: FormGroup;
  listaInsumosCrear !: insumoXRequisicionCreacion[];
  insumos !: InsumoDTO[];
  tipoInsumos !: tipoInsumoDTO[];
  explocionInsumos !: InsumoParaExplosionDTO[];
  explocionInsumosparaRequisicion !: InsumoParaExplosionDTO[];
  requisicion: requisicionCreacionDTO = {
    idProyecto: 0,
    observaciones: "",
    listaInsumosRequisicion: [],
    residente: ""
  }

  constructor(
    public dialogRef: MatDialogRef<ModalNewRequisicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _requisicionService: RequisicionService,
    private _insumo: InsumoService, 
    private _existencias : ExistenciasService,
    private _tipoInsumo : TipoInsumoService,
    private _explosionInsumos : PrecioUnitarioService
  ) { }


  ngOnInit(): void {
    this.dialogRef.updateSize('80%'); // Actualiza el tamaño del diálogo
    this.form = this.formBuilder.group({
      observaciones: ['', { validators: [], },],
      residente: ['', { validators: [], },]

    })
    this.limpiarRequisicion();
    this.listaInsumosCrear = this.data.listaInsumosCrear;
    this._explosionInsumos.explosionDeInsumos(this.data.idProyecto, this.data.selectedEmpresa).subscribe((datos) =>{
      this.explocionInsumos = datos;
      this.explocionInsumosparaRequisicion = this.explocionInsumos.filter(z => z.idTipoInsumo != 10000 && z.idTipoInsumo != 3 && z.idTipoInsumo != 10001);
    });
    this._insumo.obtenerXIdProyecto(this.data.selectedEmpresa, this.data.idProyecto).subscribe((datos) => {
      this.insumos = datos;
    });
    this._tipoInsumo.TipoInsumosParaRequisitar(this.data.selectedEmpresa).subscribe((datos) => {
      this.tipoInsumos = datos;
    });
    const hoy = new Date()
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    this.listaInsumosCrear.push({
      descripcion: "",
      unidad: "",
      cantidad: 0,
      folio: "",
      personaIniciales: "",
      denominacionBool: false,
      denominacion: 0,
      observaciones: "Ninguna",
      fechaEntrega: ayer,
      idTipoInsumo: 0,
      idInsumo: 0,
      cUnitario: 0,
      cPresupuestada: 0,
      idRequisicion: 0
    });
  }

  agregarNuevoInsumo() {
    let numeroinusmos = 0;
    this.listaInsumosCrear.forEach((element) => {
      let insumosDuplicados = this.listaInsumosCrear.filter(z => z.descripcion.toLowerCase() == element.descripcion.toLowerCase() &&
        z.unidad.toLowerCase() == element.unidad.toLowerCase());
      const F1 = formatDate(element.fechaEntrega, 'yyyy-MM-dd', 'en_US');
      const F2 = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');

      if (element.descripcion.length <= 0 || typeof element.descripcion == undefined || element.descripcion == "" ||
        element.unidad.length <= 0 || typeof element.unidad == undefined || element.unidad == "" ||
        element.cantidad <= 0 || typeof element.descripcion == undefined || element.descripcion == "" ||
        // element.personaIniciales.length <= 0 || typeof element.personaIniciales == undefined || element.personaIniciales == "" ||
        element.observaciones.length <= 0 || typeof element.observaciones == undefined || element.observaciones == "" ||
        F1 < F2 || F1 >= formatDate(new Date(9999, 0, 1), 'yyyy-MM-dd', 'en_US') ||
        insumosDuplicados.length > 1
      ) {
        numeroinusmos = numeroinusmos + 1;
      }
    });
    if (numeroinusmos > 0) {
      return;
    }
    const hoy = new Date()
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    this.listaInsumosCrear.push({
      descripcion: "",
      unidad: "",
      cantidad: 0,
      folio: "",
      personaIniciales: "",
      denominacionBool: false,
      denominacion: 0,
      observaciones: "Ninguna",
      fechaEntrega: ayer,
      idTipoInsumo: 0,
      idInsumo: 0,
      cUnitario: 0,
      cPresupuestada: 0,
      idRequisicion: 0
    });
  }



  cerrar() {
    this.listaInsumosCrear = [];
    this.limpiarRequisicion();
    this.dialogRef.close(false); // Cierra el diálogo y pasa false para indicar que se canceló la operación
  }



  guardarRequisicion() {
    if (this.form.get("observaciones")?.value == "" ||
      this.form.get("observaciones")?.value == undefined ||
      this.form.get("observaciones")?.value.length <= 0 || this.form.get("residente")?.value == "" ||
      this.form.get("residente")?.value == undefined ||
      this.form.get("residente")?.value.length <= 0) {
      Swal.fire({
        title: "Error",
        text: "Procura llenar los campos",
        icon: "error"
      });
    } else {
      this.requisicion.idProyecto = this.data.idProyecto;
      this.requisicion.observaciones = this.form.get("observaciones")?.value;
      this.requisicion.residente = this.form.get("residente")?.value;
      let n = 0;
      let errorduplicado = 0;
      this.listaInsumosCrear.forEach((element) => {
        let insumoRepetido = this.listaInsumosCrear.filter(z => z.descripcion.toLowerCase() == element.descripcion.toLowerCase() &&
          z.unidad.toLowerCase() == element.unidad.toLowerCase());

        const F1 = formatDate(element.fechaEntrega, 'yyyy-MM-dd', 'en_US');
        const F2 = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');

        if (element.descripcion != '' &&
          element.unidad != '' &&
          element.cantidad > 0 &&
          element.observaciones != '' &&
          insumoRepetido.length < 2 &&
          F1 >= F2 && F1 < formatDate(new Date(9999, 0, 1), 'yyyy-MM-dd', 'en_US') 
        ) {

          element.denominacion = element.denominacionBool ? 1 : 0;
          this.requisicion.listaInsumosRequisicion.push(element);
          n++;
        } else {
          if (element.descripcion == '' &&
            element.unidad == '' &&
            element.cantidad <= 0 &&
            element.observaciones == '' &&
            insumoRepetido.length < 2 &&
            F1 < F2 && F1 >= formatDate(new Date(9999, 0, 1), 'yyyy-MM-dd', 'en_US') 
          ) {

          } else {
            errorduplicado++;
          }

        }

      });
      if (errorduplicado > 0) {
        Swal.fire({
          title: "Error",
          text: "Capture la información correctamente",
          icon: "error"
        });
        return;
      }
      this._requisicionService.CrearRequisicion(this.data.selectedEmpresa, this.requisicion).subscribe((datos) => {
        if (datos.estatus) {
          this.dialogRef.close(false);
          this.closeModal.nativeElement.click()
        } else {
          Swal.fire({
            title: "Error",
            text: datos.descripcion,
            icon: "error"
          });
        }

      });
      this.form.reset();
      this.listaInsumosCrear = [];
      const hoy = new Date()
      const ayer = new Date(hoy);
      ayer.setDate(hoy.getDate() - 1);
      this.listaInsumosCrear.push({
        descripcion: "",
        unidad: "",
        cantidad: 0,
        folio: "",
        personaIniciales: "",
        denominacionBool: false,
        denominacion: 0,
        observaciones: "",
        fechaEntrega: ayer,
        idTipoInsumo: 0,
        idInsumo: 0,
        cUnitario: 0,
        cPresupuestada: 0,
        idRequisicion: 0
      });
      this.limpiarRequisicion();
    }

  }


  limpiarRequisicion() {
    this.requisicion.idProyecto = 0;
    this.requisicion.observaciones = "";
    this.requisicion.listaInsumosRequisicion = [];
    this.listaInsumosCrear = [];
  }

  informacionInsumo(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const idInsumo = this.insumos.find(insumo => insumo.descripcion.replace(/ /g, "") == selectedValue.replace(/ /g, ""))?.id || 0;

    if(idInsumo != 0){
      let insumo = this.explocionInsumosparaRequisicion.filter(insumo => insumo.id == idInsumo);

    this.listaInsumosCrear.forEach((element) => {
      if (element.descripcion.replace(/ /g, "") == insumo[0].descripcion.replace(/ /g, "")) {
        element.unidad = insumo[0].unidad;
        element.idTipoInsumo = insumo[0].idTipoInsumo;
        element.idInsumo = insumo[0].id;
        element.cUnitario = insumo[0].costoUnitario;
        element.cPresupuestada = insumo[0].cantidad;
        return;
      }
    });
    }
  }

  verDetalleInsumo(idInsumo : number){
    if(idInsumo <= 0){
      Swal.fire({
        title: "Error",
        text: "No se ha especificado un insumo",
        icon: "success"
      });
      return;
    }
    this._existencias.existenciaYAlmacenDeInsumo(this.data.selectedEmpresa, idInsumo, this.data.idProyecto).subscribe((datos) => {
      if(datos.estatus){
        Swal.fire({
          title: "Insumo encontrado",
          text: datos.descripcion,
          icon: "success"
        });
      }else{
        Swal.fire({
          title: "Informacion insumo",
          text: datos.descripcion,
          icon: "success"
        });
      }
    });
  }

  EliminarListaInsumosXRequisicion(descripcion: string, unidad: string, persona: string) {
    if (this.listaInsumosCrear.length > 1) {
      var filtrarObjeto = this.listaInsumosCrear.findIndex(z => z.descripcion == descripcion && z.unidad == unidad)
      if (filtrarObjeto > -1) {
        this.listaInsumosCrear.splice(filtrarObjeto, 1);
      }
    }
  }


  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }



}
