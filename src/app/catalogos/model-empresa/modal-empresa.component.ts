import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilidadesService } from 'src/app/utilidades/utilidades.service';
import { ResponseApi } from 'src/app/utilidades/tsUtilidades';
import { CorporativoService } from '../corporativo/corporativo.service';
import { corporativo } from 'src/app/seguridad/usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { EmpresaService } from '../empresas/empresa.service';
import { Empresa1 } from '../empresas/empresa';

@Component({
  selector: 'app-modal-empresa',
  templateUrl: './modal-empresa.component.html',
  styleUrls: ['./modal-empresa.component.css']
})
export class ModalEmpresaComponent {
  formularioEmpresa: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaCorporativos: corporativo[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public datosEmpresa: Empresa1,
    private fb: FormBuilder,
    private _empresaServicio: EmpresaService,
    private _corporativoServicio: CorporativoService,
    private _utilidadServicio: UtilidadesService
  ) {
    this.formularioEmpresa = this.fb.group({
      anio: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      rfc: ['', Validators.required],
      pais: ['', Validators.required],
      estado: ['', Validators.required],
      cp: ['', Validators.required],
      colonia: ['', Validators.required],
      municipio: ['', Validators.required],
      localidad: ['', Validators.required],
      direccion: ['', Validators.required],
      noExt: ['', Validators.required],
      noInt: [''],
      referencia: [''],
      telefono: [''],
      telefonoVenta: [''],
      email: [''],
      estatus: ['1', Validators.required],
      idCorporativo: ['', Validators.required],
      corporativoDescripcion: [''],
    });

    if (this.datosEmpresa != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }

    this._corporativoServicio.lista().subscribe((data) => {
        this.listaCorporativos = data;
      });
  }

  ngOnInit(): void {
    // if (this.datosEmpresa != null) {
    //   this.formularioEmpresa.patchValue({
    //     anio: this.datosEmpresa.anio,
    //     nombre: this.datosEmpresa.nombre,
    //     descripcion: this.datosEmpresa.descripcion,
    //     rfc: this.datosEmpresa.rfc,
    //     pais: this.datosEmpresa.pais,
    //     estado: this.datosEmpresa.estado,
    //     cp: this.datosEmpresa.cp,
    //     colonia: this.datosEmpresa.colonia,
    //     municipio: this.datosEmpresa.municipio,
    //     localidad: this.datosEmpresa.localidad,
    //     direccion: this.datosEmpresa.direccion,
    //     noExt: this.datosEmpresa.noExt,
    //     noInt: this.datosEmpresa.noInt,
    //     referencia: this.datosEmpresa.referencia,
    //     telefono: this.datosEmpresa.telefono,
    //     telefonoVenta: this.datosEmpresa.telefonoVenta,
    //     email: this.datosEmpresa.email,
    //     estatus: this.datosEmpresa.estatus.toString(),
    //     idCorporativo: this.datosEmpresa.idCorporativo,
    //   });
    // }
  }

  guardarEditar_Empresa() {
    // const _empresa: Empresa = {
    //   id: this.datosEmpresa == null ? 0 : this.datosEmpresa.id,
    //   anio: this.formularioEmpresa.value.anio,
    //   nombre: this.formularioEmpresa.value.nombre,
    //   descripcion: this.formularioEmpresa.value.descripcion,
    //   rfc: this.formularioEmpresa.value.rfc,
    //   pais: this.formularioEmpresa.value.pais,
    //   estado: this.formularioEmpresa.value.estado,
    //   cp: this.formularioEmpresa.value.cp,
    //   colonia: this.formularioEmpresa.value.colonia,
    //   municipio: this.formularioEmpresa.value.municipio,
    //   localidad: this.formularioEmpresa.value.localidad,
    //   direccion: this.formularioEmpresa.value.direccion,
    //   noExt: this.formularioEmpresa.value.noExt,
    //   noInt: this.formularioEmpresa.value.noInt,
    //   referencia: this.formularioEmpresa.value.referencia,
    //   telefono: this.formularioEmpresa.value.telefono,
    //   telefonoVenta: this.formularioEmpresa.value.telefonoVenta,
    //   email: this.formularioEmpresa.value.email,
    //   estatus: this.formularioEmpresa.value.estatus,
    //   idCorporativo: this.formularioEmpresa.value.idCorporativo,
    //   corporativoDescripcion: '',
    //   sociedad: '',
    //   division: ''
    // };

    // if (this.datosEmpresa == null) {
    //   this._empresaServicio.guardarMarioEmpresa(_empresa).subscribe({
    //     next: (data: any) => {
    //       if (data.status) {
    //         this._utilidadServicio.mostrarAlerta(
    //           'La empresa fue registrada',
    //           'Exito'
    //         );
    //         this.modalActual.close('true');
    //       } else
    //         this._utilidadServicio.mostrarAlerta(
    //           'No se pudo registrar la empresa',
    //           'Error'
    //         );
    //     },
    //     error: (e) => {},
    //   });
    // } else {
    //   this._empresaServicio.editarMarioEmpresa(_empresa).subscribe({
    //     next: (data) => {
    //       if (data.status) {
    //         this._utilidadServicio.mostrarAlerta(
    //           'La Empresa fue editada',
    //           'Exito'
    //         );
    //         this.modalActual.close('true');
    //       } else
    //         this._utilidadServicio.mostrarAlerta(
    //           'No se pudo editar la Empresa',
    //           'Error'
    //         );
    //     },
    //     error: (e) => {},
    //   });
    // }

  }
}
