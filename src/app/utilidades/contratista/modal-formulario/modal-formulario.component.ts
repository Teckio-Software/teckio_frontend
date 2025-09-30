import { Component, OnInit, Input, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { merge } from 'rxjs';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { AlertaTipo, AlertComponent } from '../../alert/alert.component';
import { RespuestaDTO } from '../../tsUtilidades';

@Component({
  selector: 'app-modal-formulario',
  templateUrl: './modal-formulario.component.html',
  styleUrls: ['./modal-formulario.component.css'],
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
    idIvaAcreditableFiscal: 0,
  };

  //Variables para las muestras de mensajes de error
  errorGlobal: boolean = false;
  errorRs: boolean = false;
  errorRfc: RespuestaDTO = { estatus: false, descripcion: '' };
  errorRl: boolean = false;
  errorTp: boolean = false;
  errorCe: RespuestaDTO = { estatus: false, descripcion: '' };
  errorDm: boolean = false;
  errorTe: RespuestaDTO = { estatus: false, descripcion: '' };
  errorNE: boolean = false;

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
    // console.log(this.data.contratista);
    this.form = this.formBuilder.group({
      razonSocial: [this.data.contratista.razonSocial, { validators: [] }],
      email: [this.data.contratista.email, { validators: [] }],
      rfc: [this.data.contratista.rfc, { validators: [] }],
      domicilio: [this.data.contratista.domicilio, { validators: [] }],
      representanteLegal: [
        this.data.contratista.representanteLegal,
        { validators: [] },
      ],
      telefono: [this.data.contratista.telefono, { validators: [] }],
      nExterior: [this.data.contratista.nExterior, { validators: [] }],
      esProveedorServicio: [
        this.data.contratista.esProveedorServicio,
        { validators: [] },
      ],
      esProveedorMaterial: [
        this.data.contratista.esProveedorMaterial,
        { validators: [] },
      ],
      colonia: [this.data.contratista.colonia, { validators: [] }],
      municipio: [this.data.contratista.municipio, { validators: [] }],
      codigoPostal: [this.data.contratista.codigoPostal, { validators: [] }],
      idCuentaContable: [
        this.data.contratista.idCuentaContable,
        { validators: [] },
      ],
      idIvaAcreditableContable: [
        this.data.contratista.idIvaAcreditableContable,
        { validators: [] },
      ],
      idIvaPorAcreditar: [
        this.data.contratista.idIvaPorAcreditar,
        { validators: [] },
      ],
      idCuentaAnticipos: [
        this.data.contratista.idCuentaAnticipos,
        { validators: [] },
      ],
      idCuentaRetencionISR: [
        this.data.contratista.idCuentaRetencionISR,
        { validators: [] },
      ],
      idCuentaRetencionIVA: [
        this.data.contratista.idCuentaRetencionIVA,
        { validators: [] },
      ],
      idEgresosIvaExento: [
        this.data.contratista.idEgresosIvaExento,
        { validators: [] },
      ],
      idEgresosIvaGravable: [
        this.data.contratista.idEgresosIvaGravable,
        { validators: [] },
      ],
      idIvaAcreditableFiscal: [
        this.data.contratista.idIvaAcreditableFiscal,
        { validators: [] },
      ],
    });
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

  guardar() {
    this.errorGlobal = false;
    this.errorRs = false;
    this.errorRfc.estatus = false;
    this.errorRl = false;
    this.errorTp = false;
    this.errorCe.estatus = false;
    this.errorDm = false;
    this.errorTe.estatus = false;
    this.errorNE = false;

    this.Contratista.razonSocial = this.form.get('razonSocial')?.value;
    this.Contratista.email = this.form.get('email')?.value;
    this.Contratista.rfc = this.form.get('rfc')?.value;
    this.Contratista.domicilio = this.form.get('domicilio')?.value;
    this.Contratista.representanteLegal =
      this.form.get('representanteLegal')?.value;
    this.Contratista.telefono = this.form.get('telefono')?.value;
    this.Contratista.nExterior = this.form.get('nExterior')?.value;
    this.Contratista.esProveedorServicio = this.form.get(
      'esProveedorServicio'
    )?.value;
    this.Contratista.esProveedorMaterial = this.form.get(
      'esProveedorMaterial'
    )?.value;
    this.Contratista.colonia = this.form.get('colonia')?.value;
    this.Contratista.municipio = this.form.get('municipio')?.value;
    this.Contratista.codigoPostal = this.form.get('codigoPostal')?.value;
    this.Contratista.idCuentaContable =
      this.form.get('idCuentaContable')?.value;
    this.Contratista.idIvaAcreditableContable = this.form.get(
      'idIvaAcreditableContable'
    )?.value;
    this.Contratista.idIvaPorAcreditar =
      this.form.get('idIvaPorAcreditar')?.value;
    this.Contratista.idCuentaAnticipos =
      this.form.get('idCuentaAnticipos')?.value;
    this.Contratista.idCuentaRetencionISR = this.form.get(
      'idCuentaRetencionISR'
    )?.value;
    this.Contratista.idCuentaRetencionIVA = this.form.get(
      'idCuentaRetencionIVA'
    )?.value;
    this.Contratista.idEgresosIvaExento =
      this.form.get('idEgresosIvaExento')?.value;
    this.Contratista.idEgresosIvaGravable = this.form.get(
      'idEgresosIvaGravable'
    )?.value;
    this.Contratista.idIvaAcreditableFiscal = this.form.get(
      'idIvaAcreditableFiscal'
    )?.value;

    if (
      (this.Contratista.razonSocial == null ||
        this.Contratista.razonSocial.trim() == '') &&
      (this.Contratista.rfc == null || this.Contratista.rfc.trim() == '') &&
      (this.Contratista.representanteLegal == null ||
        this.Contratista.representanteLegal.trim() == '') &&
      this.Contratista.esProveedorServicio == false &&
      this.Contratista.esProveedorMaterial == false &&
      (this.Contratista.email == null || this.Contratista.email.trim() == '') &&
      (this.Contratista.domicilio == null ||
        this.Contratista.domicilio.trim() == '') &&
      (this.Contratista.telefono == null ||
        this.Contratista.telefono.trim() == '') &&
      (this.Contratista.nExterior == null ||
        this.Contratista.nExterior.trim() == '')
    ) {
      this.errorGlobal = true;
      return;
    }

    var cont = true;

    if (
      this.Contratista.razonSocial == null ||
      this.Contratista.razonSocial.trim() == ''
    ) {
      this.errorRs = true;
      cont = false;
    }
    
    if (this.Contratista.rfc.trim().length<12) {
      this.errorRfc.estatus = true;
      this.errorRfc.descripcion = "El campo 'RFC' debe tener 12 o 13 caracteres";
      cont = false;
    }
    if (this.Contratista.rfc == null || this.Contratista.rfc.trim() == '') {
      this.errorRfc.estatus = true;
      this.errorRfc.descripcion = "El campo 'RFC' es obligatorio";
      cont = false;
    }
    if (this.Contratista.rfc.includes(' ')) {
      this.errorRfc.estatus = true;
      this.errorRfc.descripcion = "El campo 'RFC' no puede contener espacios";
      cont = false;
    }
    if (
      this.Contratista.representanteLegal == null ||
      this.Contratista.representanteLegal.trim() == ''
    ) {
      this.errorRl = true;
      cont = false;
    }
    if (
      this.Contratista.esProveedorServicio == false &&
      this.Contratista.esProveedorMaterial == false
    ) {
      this.errorTp = true;
      cont = false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(this.Contratista.email)) {
      this.errorCe.estatus = true;
      this.errorCe.descripcion = "El campo Correo electrónico no es válido";
      cont = false;
    }
    //Se le quitan los espacios en automático
    this.Contratista.email = this.Contratista.email.trim();
    if (this.Contratista.email == null || this.Contratista.email == '') {
      this.errorCe.estatus = true;
      this.errorCe.descripcion = "El campo 'Correo electrónico' es obligatorio";
      cont = false;
    }
    
    if (
      this.Contratista.domicilio == null ||
      this.Contratista.domicilio.trim() == ''
    ) {
      this.errorDm = true;
      cont = false;
    }
    
    if (
      this.Contratista.telefono.trim().length<10
    ) {
      this.errorTe.estatus = true;
      this.errorTe.descripcion = "El campo 'Teléfono' debe tener 10 caracteres";
      cont = false;
    }
    if (
      this.Contratista.telefono == null ||
      this.Contratista.telefono.trim() == ''
    ) {
      this.errorTe.estatus = true;
      this.errorTe.descripcion = "El campo 'Teléfono' es obligatorio";
      cont = false;
    }
    if (
      this.Contratista.nExterior == null ||
      this.Contratista.nExterior.trim() == ''
    ) {
      this.errorNE = true;
      cont = false;
    }

    if (!cont) {
      return;
    }

    // console.log("este es el valor", this.Contratista);
    if (this.data.contratista.id == 0) {
      this.contratistaService
        .crearYObtener(this.Contratista, this.selectedEmpresa)
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    } else {
      this.Contratista.id = this.data.contratista.id;
      console.log('Tiene que editar', this.Contratista);
      this.contratistaService
        .editar(this.Contratista, this.selectedEmpresa)
        .subscribe((datos) => {
          console.log(datos);
          this.dialogRef.close(true);
        });
    }
  }

  /**
 * Filtra los caracteres no numéricos de un input de tipo texto
 * @param {Event} e - Evento que se desencadena cuando se escribe algo en el input
 * Elimina inmediatamente los caracteres no numéricos del input y ajusta la posición del cursor
 * para que no se mueva inesperadamente.
 */
  filterNonNumeric(e: Event) {
  const inputElement = e.target as HTMLInputElement;
  //Obtiene la posición del cursor
  const start = inputElement.selectionStart;
  //Obtiene el valor del texto
  let valor = inputElement.value;
  //Elimina inmediatamente el carácter no numérico
  const valorFiltrado = valor.replace(/\D/g, '');
  inputElement.value = valorFiltrado;
  this.form.get('telefono')?.setValue(valorFiltrado, { emitEvent: false }); 
  //Restablece la posición del cursor para una mejor experiencia de usuario
  if (start !== null) {
    // Si se eliminó algo ajusta la posición del cursor.
    if (valor.length !== valorFiltrado.length) {
      // Intenta mover el cursor una posición menos si se eliminó un carácter antes de él.
      inputElement.setSelectionRange(start - 1, start - 1);
    } else {
      // Si no se eliminó nada, mantén la posición.
      inputElement.setSelectionRange(start, start);
    }
  }
}
}
