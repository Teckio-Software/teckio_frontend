import { usuarioProyectoDTO } from './../../../seguridad/usuario-multi-empresa-filtrado/proyecto-usuario/tsUsuarioProyecto';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { proyectoDTO } from '../tsProyecto';
import { ProyectoService } from '../proyecto.service';
import Swal from 'sweetalert2';
import { parsearErroresAPI, RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { ProyectoUsuarioService } from 'src/app/seguridad/usuario-multi-empresa-filtrado/proyecto-usuario/proyecto-usuario.service';

@Component({
  selector: 'app-dialog-new-proyecto',
  templateUrl: './dialog-new-proyecto.component.html',
  styleUrls: ['./dialog-new-proyecto.component.css'],
})
export class DialogNewProyectoComponent {
  form!: FormGroup;
  menu1: boolean;
  dialogTitle = 'Nuevo proyecto';
  primaryButtonLabel = 'Crear proyecto';
  isEditing = false;
  nuevoProyecto: proyectoDTO = {
    id: 0,
    codigoProyecto: '',
    nombre: '',
    noSerie: 0,
    moneda: '',
    presupuestoSinIva: 0,
    tipoCambio: 0,
    presupuestoSinIvaMonedaNacional: 0,
    porcentajeIva: 0,
    presupuestoConIvaMonedaNacional: 0,
    anticipo: 0,
    codigoPostal: 0,
    domicilio: '',
    fechaInicio: new Date(),
    fechaFinal: new Date(),
    tipoProgramaActividad: 0,
    inicioSemana: 0,
    esSabado: true,
    esDomingo: true,
    idPadre: 0,
    nivel: 0,
    expandido: false,
    hijos: [],
  };
  selectedEmpresa: number;

  parametrosRol: usuarioProyectoDTO = {
    id: 0,
    idUsuario: 0,
    idEmpresa: 0,
    idProyecto: 0,
    nombreProyecto: '',
    estatus: false,
  };
  constructor(
    public dialogRef: MatDialogRef<DialogNewProyectoComponent>,

    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private proyectoService: ProyectoService,
    private _usuarioProyectoService: ProyectoUsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.menu1 = this.data.menu1;
    this.selectedEmpresa = this.data.selectedEmpresa;
    this.isEditing = !!this.data.proyecto;
    this.dialogTitle = this.isEditing ? 'Editar proyecto' : 'Nuevo proyecto';
    this.primaryButtonLabel = this.isEditing ? 'Guardar cambios' : 'Crear proyecto';
  }
  ngOnInit(): void {
    this.dialogRef.updateSize('70%');

    if (!this.data.proyecto) {
      this.form = this.formBuilder.group({
        id: [0, { validators: [] }],
        codigoProyecto: ['', { validators: [] }], //
        nombre: ['', { validators: [] }], //
        noSerie: [1, { validators: [] }], //
        moneda: ['MXN', { validators: [] }],
        presupuestoSinIva: [0, { validators: [] }], //
        tipoCambio: ['', { validators: [] }], //
        presupuestoSinIvaMonedaNacional: ['', { validators: [] }],
        porcentajeIva: ['', { validators: [] }], //
        presupuestoConIvaMonedaNacional: [0, { validators: [] }],
        anticipo: ['', { validators: [] }], //
        codigoPostal: ['', { validators: [] }], //
        domicilio: ['', { validators: [] }], //
        fechaInicio: ['', { validators: [] }], //
        fechaFinal: ['', { validators: [] }], //
        tipoProgramaActividad: ['', { validators: [] }], //
        inicioSemana: ['', { validators: [] }], //
        esSabado: [false, { validators: [] }], //
        esDomingo: [false, { validators: [] }], //
        idPadre: ['', { validators: [] }], //
        nivel: ['', { validators: [] }], //
      });
    } else {
      this.form = this.formBuilder.group({
        id: [this.data.proyecto.id, { validators: [] }],
        codigoProyecto: [this.data.proyecto.codigoProyecto, { validators: [] }], //
        nombre: [this.data.proyecto.nombre, { validators: [] }], //
        noSerie: [1, { validators: [] }], //
        moneda: [this.data.proyecto.moneda, { validators: [] }],
        presupuestoSinIva: [0, { validators: [] }], //
        tipoCambio: ['', { validators: [] }], //
        presupuestoSinIvaMonedaNacional: ['', { validators: [] }],
        porcentajeIva: [this.data.proyecto.porcentajeIva, { validators: [] }], //
        presupuestoConIvaMonedaNacional: [0, { validators: [] }],
        anticipo: ['', { validators: [] }], //
        codigoPostal: [this.data.proyecto.codigoPostal, { validators: [] }], //
        domicilio: [this.data.proyecto.domicilio, { validators: [] }], //
        fechaInicio: [this.data.proyecto.fechaInicio, { validators: [] }], //
        fechaFinal: [this.data.proyecto.fechaFinal, { validators: [] }], //
        tipoProgramaActividad: ['', { validators: [] }], //
        inicioSemana: ['', { validators: [] }], //
        esSabado: [false, { validators: [] }], //
        esDomingo: [false, { validators: [] }], //
        idPadre: ['', { validators: [] }], //
        nivel: ['', { validators: [] }], //
      });
    }
  }

  guardar() {
    this.nuevoProyecto = this.form.value;
    this.nuevoProyecto.nivel = 0;
    this.nuevoProyecto.presupuestoSinIvaMonedaNacional = 0;
    this.nuevoProyecto.nivel = 1;
    this.nuevoProyecto.idPadre = 0;
    this.nuevoProyecto.inicioSemana = 1;
    this.nuevoProyecto.anticipo = 0;
    this.nuevoProyecto.tipoProgramaActividad = 1;
    this.nuevoProyecto.tipoCambio = 0;
    this.nuevoProyecto.esSabado = true;
    this.nuevoProyecto.esDomingo = true;
    this.nuevoProyecto.noSerie = 1;

    if (this.nuevoProyecto.id == 0) {
      this.proyectoService.crear(this.nuevoProyecto, this.selectedEmpresa).subscribe({
        next: (datos) => {
          if (datos.id > 0) {
            this.parametrosRol.idEmpresa = this.selectedEmpresa;
            this.parametrosRol.idProyecto = datos.id;
            this._usuarioProyectoService.asignarRolDefault(this.parametrosRol).subscribe({
              error: (error) =>
                this.mostrarError('No se pudo asignar el rol default del proyecto', error),
            });
            const proyectoCreado = { ...datos, ...this.nuevoProyecto, id: datos.id };
            this.proyectoService.OnChange.emit(this.selectedEmpresa);
            this.form.reset();
            this.dialogRef.close({
              action: 'create',
              proyecto: proyectoCreado,
            });
            Swal.fire({
              title: 'Proyecto creado correctamente.',
              icon: 'success',
            });
          } else {
            Swal.fire({
              title: 'No se pudo crear el proyecto',
              text: 'El servidor no devolvió un identificador valido.',
              icon: 'error',
            });
          }
        },
        error: (error) => {
          this.mostrarError('No se pudo crear el proyecto', error);
        },
      });
    } else {
      this.proyectoService.editar(this.nuevoProyecto, this.selectedEmpresa).subscribe({
        next: (datos) => {
          this.proyectoService.OnChange.emit(this.selectedEmpresa);
          this.form.reset();
          this.dialogRef.close({
            action: 'edit',
            proyecto: { ...this.nuevoProyecto },
          });
          Swal.fire({
            title: 'Proyecto editado correctamente.',
            icon: 'success',
          });
        },
        error: (error) => {
          this.mostrarError('No se pudo editar el proyecto', error);
        },
      });
    }
  }

  cerrarDialog() {
    this.dialogRef.close(false);
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  private mostrarError(titulo: string, error: any) {
    const errores = parsearErroresAPI(error);
    const mensaje =
      errores.length > 0
        ? errores.join('\n')
        : 'Ocurrió un problema al comunicarse con el servidor.';
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'error',
    });
  }
}
