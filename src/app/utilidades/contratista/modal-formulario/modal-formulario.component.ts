import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { merge } from 'rxjs';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';

@Component({
  selector: 'app-modal-formulario',
  templateUrl: './modal-formulario.component.html',
  styleUrls: ['./modal-formulario.component.css']
})
export class ModalFormularioComponent implements OnInit {
  form!: FormGroup;
  selectedEmpresa: number = 0;
  email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = '';
  Contratista: contratistaDTO = {
    id: 0,
    razonSocial: '',
    rfc: '',
    esProveedorServicio: false,
    esProveedorMaterial: false,
    representanteLegal: '',
    telefono: '',
    email: '',
    domicilio: '',
    nExterior: '',
    colonia: '',
    municipio: '',
    codigoPostal: '',
    idCuentaContable: 0,
    idIvaAcreditableContable: 0,
    idIvaPorAcreditar: 0,
    idCuentaAnticipos: 0,
    idCuentaRetencionISR: 0,
    idCuentaRetencionIVA: 0,
    idEgresosIvaExento: 0,
    idEgresosIvaGravable: 0,
    idIvaAcreditableFiscal: 0
  }
  constructor(
    public dialogRef: MatDialogRef<ModalFormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private contratistaService: ContratistaService,
    private seguridadService: SeguridadService
    


  ) {

    merge(this.email.statusChanges, this.email.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateErrorMessage());
    let idEmpresa = seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    console.log(this.data.contratista);
    this.form = this.formBuilder.group({
      razonSocial: [this.data.contratista.razonSocial, {validators: [],},]
      , email: [this.data.contratista.email, {validators: [],},]
      , rfc: [this.data.contratista.rfc, {validators: [],},]
      , domicilio: [this.data.contratista.domicilio, {validators: [],},]
      , representanteLegal: [this.data.contratista.representanteLegal, {validators: [],},]
      , telefono: [this.data.contratista.telefono, {validators: [],},]
      , nExterior: [this.data.contratista.nExterior, {validators: [],},]
      , esProveedorServicio: [this.data.contratista.esProveedorServicio, {validators: [],},]
      , esProveedorMaterial: [this.data.contratista.esProveedorMaterial, {validators: [],},]
      , colonia: [this.data.contratista.colonia, {validators: [],},]
      , municipio: [this.data.contratista.municipio, {validators: [],},]
      , codigoPostal: [this.data.contratista.codigoPostal, {validators: [],},]
      , idCuentaContable: [this.data.contratista.idCuentaContable, {validators: [],},]
     , idIvaAcreditableContable: [this.data.contratista.idIvaAcreditableContable, {validators: [],},]
     , idIvaPorAcreditar: [this.data.contratista.idIvaPorAcreditar, {validators: [],},]
     , idCuentaAnticipos: [this.data.contratista.idCuentaAnticipos, {validators: [],},]
     , idCuentaRetencionISR: [this.data.contratista.idCuentaRetencionISR, {validators: [],},]
     ,  idCuentaRetencionIVA: [this.data.contratista.idCuentaRetencionIVA, {validators: [],},]
     , idEgresosIvaExento: [this.data.contratista.idEgresosIvaExento, {validators: [],},] 
      , idEgresosIvaGravable: [this.data.contratista.idEgresosIvaGravable, {validators: [],},]
      ,  idIvaAcreditableFiscal: [this.data.contratista.idIvaAcreditableFiscal, {validators: [],},]
    })
  }

  cerrar(): void {
    this.dialogRef.close(false); // Cierra el diálogo y pasa false para indicar que se canceló la operación
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }

  guardar(){
    this.Contratista.razonSocial = this.form.get("razonSocial")?.value;
    this.Contratista.email = this.form.get("email")?.value;
    this.Contratista.rfc = this.form.get("rfc")?.value;
    this.Contratista.domicilio = this.form.get("domicilio")?.value;
    this.Contratista.representanteLegal = this.form.get("representanteLegal")?.value;
    this.Contratista.telefono = this.form.get("telefono")?.value;
    this.Contratista.nExterior = this.form.get("nExterior")?.value;
    this.Contratista.esProveedorServicio = this.form.get("esProveedorServicio")?.value;
    this.Contratista.esProveedorMaterial = this.form.get("esProveedorMaterial")?.value;
    this.Contratista.colonia = this.form.get("colonia")?.value;
    this.Contratista.municipio = this.form.get("municipio")?.value;
    this.Contratista.codigoPostal = this.form.get("codigoPostal")?.value;
    this.Contratista.idCuentaContable = this.form.get("idCuentaContable")?.value;
    this.Contratista.idIvaAcreditableContable = this.form.get("idIvaAcreditableContable")?.value;
    this.Contratista.idIvaPorAcreditar = this.form.get("idIvaPorAcreditar")?.value;
    this.Contratista.idCuentaAnticipos = this.form.get("idCuentaAnticipos")?.value;
    this.Contratista.idCuentaRetencionISR = this.form.get("idCuentaRetencionISR")?.value;
    this.Contratista.idCuentaRetencionIVA = this.form.get("idCuentaRetencionIVA")?.value;
    this.Contratista.idEgresosIvaExento = this.form.get("idEgresosIvaExento")?.value;
    this.Contratista.idEgresosIvaGravable = this.form.get("idEgresosIvaGravable")?.value;
    this.Contratista.idIvaAcreditableFiscal = this.form.get("idIvaAcreditableFiscal")?.value;
    console.log("este es el valor", this.Contratista);
    if(this.data.contratista.id == 0){
      this.contratistaService.crearYObtener(this.Contratista, this.selectedEmpresa)
      .subscribe(() =>{
        this.dialogRef.close(true);
      })
    }else{
      this.Contratista.id = this.data.contratista.id;
      console.log("Tiene que editar", this.Contratista);
      this.contratistaService.editar(this.Contratista, this.selectedEmpresa).subscribe((datos) => {
        console.log(datos)
        this.dialogRef.close(true);
      })
    }
  }
}
