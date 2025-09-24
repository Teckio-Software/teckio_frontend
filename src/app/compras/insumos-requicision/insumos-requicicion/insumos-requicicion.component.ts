import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { InsumoXRequisicionService } from '../insumoxrequisicion/insumoxrequisicion.service';
import {
  insumoXRequisicionCreacion,
  insumoXRequisicionDTO,
} from '../insumoxrequisicion/tsInsumoXRequisicion';
import {
  InsumoDTO,
  InsumoParaExplosionDTO,
} from 'src/app/catalogos/insumo/tsInsumo';
import { TipoInsumoService } from 'src/app/catalogos/tipo-insumo/tipo-insumo.service';
import { PrecioUnitarioService } from 'src/app/proyectos/precio-unitario/precio-unitario.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { InsumoService } from 'src/app/catalogos/insumo/insumo.service';
import { tipoInsumoDTO } from 'src/app/catalogos/tipo-insumo/tsTipoInsumo';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { ExistenciasService } from 'src/app/inventario/existencia/existencias.service';
import { EmpleadoDTO } from 'src/app/seguridad/empleado/empleado';
import { EmpleadoServiceService } from 'src/app/seguridad/empleado/empleado-service.service';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';
import { Alert } from '@mui/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { da } from 'date-fns/locale';

@Component({
  selector: 'app-insumos-requicicion',
  templateUrl: './insumos-requicicion.component.html',
  styleUrls: ['./insumos-requicicion.component.css'],
})
export class InsumosRequicicionComponent implements OnInit {
  insumoXRequisicion: insumoXRequisicionDTO[] = [];
  constructor(
    private _InsumosXRequisicion: InsumoXRequisicionService,
    private _tipoInsumo: TipoInsumoService,
    private _explosionInsumos: PrecioUnitarioService,
    private _SeguridadEmpresa: SeguridadService,
    private _insumo: InsumoService,
    private formBuilder: FormBuilder,
    private _existencias: ExistenciasService,
    private _EmpleadoService: EmpleadoServiceService
  ) {
    let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
    this.idProyecto = Number(idProyecto);
  }
  @ViewChild('textoDataList') textoDataList!: any;

  @Output() recargar = new EventEmitter();
  @Output() enviarAlerta = new EventEmitter<{
    tipo: AlertaTipo;
    mensaje: string;
  }>();

  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;
  insumoControl = new FormControl('');

  explosionControl = new FormControl("")
  filteredExplosion: Observable<InsumoParaExplosionDTO[]> = new Observable<InsumoParaExplosionDTO[]>();

  @Input()
  idRequisicionInput: number = 0;
  @Input()
  idEmpresaInput: number = 0;
  @Input()
  set obteninsumosresquisicion(array: number[]) {
    this.insumoXRequisicion = [];
    if (array[0] > 0 && array[1] > 0) {
      this._InsumosXRequisicion
        .obtenerTodosInsumosRequicicion(array[0], array[1])
        .subscribe((datos) => {
          this.insumoXRequisicion = datos;
        });
    }
  }

  isEliminado: boolean = false;
  isExpanded: boolean = false;

  alertaTipo = AlertaTipo;
  descripcion: string = '';
  descripcionTitulo: string = '';

  idProyecto: number = 0;
  insumoCreacion: insumoXRequisicionCreacion = {
    descripcion: '',
    unidad: '',
    cantidad: 0,
    folio: '',
    personaIniciales: '',
    observaciones: '',
    denominacionBool: false,
    denominacion: 0,
    fechaEntrega: new Date(),
    idTipoInsumo: 0,
    idInsumo: 0,
    cUnitario: 0,
    cPresupuestada: 0,
    idRequisicion: 0,
  };
  insumoXREditado: insumoXRequisicionDTO = {
    id: 0,
    descripcion: '',
    unidad: '',
    cantidad: 0,
    folio: '',
    personaIniciales: '',
    observaciones: '',
    denominacionBool: false,
    denominacion: 0,
    estatusInsumoSurtidoDescripcion: '',
    estatusInsumoCompradoDescripcion: '',
    fechaEntrega: new Date(),
    idTipoInsumo: 0,
    idInsumo: 0,
    cUnitario: 0,
    cPresupuestada: 0,
    isExpanded: false,
  };
  explocionInsumos!: InsumoParaExplosionDTO[];
  explocionInsumosXEmpleado!: InsumoParaExplosionDTO[];
  IdUser: number = 0;
  empleado: EmpleadoDTO = {
    id: 0,
    idUser: 0,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    curp: '',
    rfc: '',
    seguroSocial: '',
    fechaRelacionLaboral: null,
    fechaTerminoRelacionLaboral: null,
    salarioDiario: 0,
    estatus: false,
    seleccionado: false,
  };

  insumos!: InsumoDTO[];
  explocionInsumosparaRequisicion!: InsumoParaExplosionDTO[];
  explocionInsumosparaRequisicionReset!: InsumoParaExplosionDTO[];

  tipoInsumos!: tipoInsumoDTO[];
  form!: FormGroup;
  idInsumo: number = 0;
  descripcionInsumo : string = "";

  @ViewChild('testInput') testInput: any;
  observacion!: string;

  disponibilidadInsumo: number = 0;

  IdInsumo: number = 0;

  ngOnInit() {
    this.IdUser = Number(this._SeguridadEmpresa.zfObtenerCampoJwt('idUsuario'));
    this.cargarRegistros();
    this.cargarExplocionInsumos();

    this._insumo
      .obtenerXIdProyecto(this.idEmpresaInput, this.idProyecto)
      .subscribe((datos) => {
        this.insumos = datos;
      });
    this._tipoInsumo
      .TipoInsumosParaRequisitar(this.idEmpresaInput)
      .subscribe((datos) => {
        this.tipoInsumos = datos;
      });
    this.form = this.formBuilder.group({
      idInsumo: [0, { validators: [] }],
      descripcion: ['', { validators: [] }],
      folio: ['', { validators: [] }],
      personaIniciales: ['', { validators: [] }],
      unidad: ['', { validators: [] }],
      idTipoInsumo: [0, { validators: [] }],
      cUnitario: [0, { validators: [] }],
      cPresupuestada: [0, { validators: [] }],
      cantidad: [0, { validators: [] }],
      fechaEntrega: [new Date(), { validators: [] }],
      observaciones: ['Ninguna', { validators: [] }],
      denominacionBool: [false, { validators: [] }],
      denominacion: [0, { validators: [] }],
      idRequisicion: [this.idRequisicionInput, { validators: [] }],
    });
    this.form.get('cUnitario')?.disable();
    this.form.get('cPresupuestada')?.disable();
  }

  lanzarAlerta(tipo: AlertaTipo, mensaje: string) {
    this.enviarAlerta.emit({ tipo, mensaje });
  }

  focus() {
    this.textarea.nativeElement.focus();
  }

  desplegarInformacion(insumoXRequisicion: insumoXRequisicionDTO) {
    insumoXRequisicion.isExpanded = !insumoXRequisicion.isExpanded;
  }

  cargarExplocionInsumos() {
    this._EmpleadoService
      .ObtenerXIdUser(this.idEmpresaInput, this.IdUser)
      .subscribe((datos) => {
        this.empleado = datos;
        if (this.empleado.id <= 0) {
          this._explosionInsumos
            .explosionDeInsumos(this.idProyecto, this.idEmpresaInput)
            .subscribe((datos) => {
              this.explocionInsumos = datos.filter(z => z.id != 0);
              this.explocionInsumosparaRequisicion =
                this.explocionInsumos.filter(
                  (z) =>
                    z.idTipoInsumo != 10000 &&
                    z.idTipoInsumo != 3 &&
                    z.idTipoInsumo != 10001
                );
              this.explocionInsumosparaRequisicionReset =
                this.explocionInsumos.filter(
                  (z) =>
                    z.idTipoInsumo != 10000 &&
                    z.idTipoInsumo != 3 &&
                    z.idTipoInsumo != 10001
                );
                this.filteredExplosion = this.explosionControl.valueChanges.pipe(
                  startWith(''),
                  map(value => {
                    const stringValue = typeof value === 'string' ? value : '';
                    return this._filter(stringValue);
                  })
                );
            });
        } else {
          this._explosionInsumos
            .obtenerExplosionDeInsumosXEmpleado(
              this.idProyecto,
              this.idEmpresaInput,
              this.empleado.id
            )
            .subscribe((datos) => {
              this.explocionInsumos = datos;
              this.explocionInsumosparaRequisicion =
                this.explocionInsumos.filter(
                  (z) =>
                    z.idTipoInsumo != 10000 &&
                    z.idTipoInsumo != 3 &&
                    z.idTipoInsumo != 10001
                );
              this.explocionInsumosparaRequisicionReset =
                this.explocionInsumos.filter(
                  (z) =>
                    z.idTipoInsumo != 10000 &&
                    z.idTipoInsumo != 3 &&
                    z.idTipoInsumo != 10001
                );
                this.filteredExplosion = this.explosionControl.valueChanges.pipe(
                  startWith(''),
                  map(value => {
                    const stringValue = typeof value === 'string' ? value : '';
                    return this._filter(stringValue);
                  })
                );
            });
        }
      });
  }

  cargarRegistros() {
    this.insumoXRequisicion = [];
    if (this.idRequisicionInput > 0 && this.idEmpresaInput > 0) {
      this._InsumosXRequisicion
        .obtenerTodosInsumosRequicicion(
          this.idEmpresaInput,
          this.idRequisicionInput
        )
        .subscribe((datos) => {
          this.insumoXRequisicion = datos;
          this.insumoXRequisicion.forEach((element) => {
            if (element.denominacion == 0) {
              element.denominacionBool = true;
            }
          });
        });
    }
  }

  informacionInsumo(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const idInsumo =
      this.insumos.find(
        (insumo) =>
          insumo.descripcion.replace(/ /g, '') ==
          selectedValue.replace(/ /g, '')
      )?.id || 0;
    this.form.get('idTipoInsumo')?.enable();
    this.form.get('idInsumo')?.setValue(0);
    this.form.get('unidad')?.setValue('');
    this.form.get('idTipoInsumo')?.setValue(0);
    this.form.get('cUnitario')?.setValue(0);
    this.form.get('cPresupuestada')?.setValue(0);
    this.form.get('idTipoInsumo')?.enable();
    if (idInsumo != 0) {
      let insumo = this.explocionInsumosparaRequisicion.filter(
        (insumo) => insumo.id == idInsumo
      );
      this.idInsumo = insumo[0].id;
      this.form.get('idInsumo')?.setValue(insumo[0].id);
      this.form.get('unidad')?.setValue(insumo[0].unidad);
      this.form.get('idTipoInsumo')?.setValue(insumo[0].idTipoInsumo);
      this.form.get('cUnitario')?.setValue(new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(insumo[0].costoUnitario));
      this.form.get('cPresupuestada')?.setValue(new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(insumo[0].cantidad));
      this.form.get('idTipoInsumo')?.disable();
    }
  }

  selectTipoInsumo(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const idTipoInsumo = Number(selectedValue);

    if (idTipoInsumo != 0) {
      this.explocionInsumosparaRequisicion = this.explocionInsumosparaRequisicionReset.filter(z => z.idTipoInsumo == idTipoInsumo);
    } else {
      this.explocionInsumosparaRequisicion = this.explocionInsumosparaRequisicionReset;
    }
    this.filteredExplosion = this.explosionControl.valueChanges.pipe(
      startWith(this.descripcionInsumo),
      map(value => {
        const stringValue = typeof value === 'string' ? value : '';
        return this._filter(stringValue);
      })
    );
  }

/**
 * Agrega un nuevo insumo en la requisici n
 * Si el campo de fecha de entrega está vacío, se establece la fecha actual
 * Se obtiene un objeto con la informaci n del insumo a crear
 * Se verifica si el objeto cumple con los siguientes campos:
 *   - descripcion: no está vacío y no es undefined
 *   - unidad: no est  vac o y no es undefined
 *   - cantidad: debe ser mayor a 0
 *   - personaIniciales: no está vacío y no es undefined
 *   - observaciones: no está vacío y no es undefined
 * Si el objeto cumple con los campos mencionados, se crea el insumo
 * Si no hay un error al crear el insumo, se muestra un mensaje de error
 */
  agregarNuevoInsumo() {
    if (this.form.get('fechaEntrega')?.value == '') {
      this.form.get('fechaEntrega')?.setValue(new Date());
    }
    this.insumoCreacion = this.form.getRawValue();
    if(this.insumoCreacion.idInsumo == 0){
      this.insumoCreacion.descripcion == this.descripcionInsumo;
    }
    const F1 = formatDate(
      this.insumoCreacion.fechaEntrega,
      'yyyy-MM-dd',
      'en_US'
    );
    const F2 = formatDate(new Date(), 'yyyy-MM-dd', 'en_US');

    if (
      this.insumoCreacion.descripcion.length <= 0 ||
      typeof this.insumoCreacion.descripcion == undefined ||
      this.insumoCreacion.descripcion == '' ||
      this.insumoCreacion.unidad.length <= 0 ||
      typeof this.insumoCreacion.unidad == undefined ||
      this.insumoCreacion.unidad == '' ||
      this.insumoCreacion.cantidad <= 0 ||
      typeof this.insumoCreacion.descripcion == undefined ||
      this.insumoCreacion.descripcion == '' ||
      // element.personaIniciales.length <= 0 || typeof element.personaIniciales == undefined || element.personaIniciales == "" ||
      this.insumoCreacion.observaciones.length <= 0 ||
      typeof this.insumoCreacion.observaciones == undefined ||
      this.insumoCreacion.observaciones == '' ||
      F1 < F2 ||
      F1 >= formatDate(new Date(9999, 0, 1), 'yyyy-MM-dd', 'en_US')
    ) {
      console.log("Algo esta fallando en la validacion", this.insumoCreacion);
      
    } else {
      console.log("Insumo", this.insumoCreacion);

      this._InsumosXRequisicion
        .CrearInsumoXRequisicion(this.idEmpresaInput, this.insumoCreacion)
        .subscribe((datos) => {
          if (datos.estatus) {
            this.lanzarAlerta(this.alertaTipo.save, 'Insumo creado');
            this.limpiarCampos();
            this.cargarRegistros();
            this.recargar.emit(0);
          } else {
            Swal.fire({
              title: 'Error',
              text: datos.descripcion,
              icon: 'error',
            });
          }
        });
    }
  }

/**
 * Limpia los campos del formulario de insumos
 * 
 * @return void
 */
  limpiarCampos() {
    this.form.reset();
    this.form.get('observaciones')?.setValue('Ninguna');
    this.form.get('denominacion')?.setValue(0);
    this.form.get('idRequisicion')?.setValue(this.idRequisicionInput);
    this.form.get('fechaEntrega')?.setValue('');
    this.form.get('folio')?.setValue('');
    this.form.get('denominacionBool')?.setValue(false);
    this.form.get('personaIniciales')?.setValue('');
    this.form.get('idTipoInsumo')?.setValue(0);
    this.form.get('idInsumo')?.setValue(0);
    this.form.get('cantidad')?.setValue(0);
    this.form.get('cUnitario')?.setValue(0);
    this.form.get('cPresupuestada')?.setValue(0);
    this.insumoControl.setValue("");
    this.IdInsumo = 0;
  }

/**
 * Consultar la cantidad de un insumo
 * 
 * @return void
 */
  consultarCantidad(){
    if (this.form.get('idInsumo')?.value <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'No se ha especificado un insumo válido',
        icon: 'error',
      });
      return;
    }
    this.IdInsumo = this.form.get('idInsumo')?.value;
    this._existencias.existenciaYAlmacenDeInsumoCantidad(
      this.idEmpresaInput,
      this.form.get('idInsumo')?.value,
      this.idProyecto).subscribe((datos) => {
      this.disponibilidadInsumo = datos;
    })
  }

/**
 * Verifica si un insumo existe en el almacén
 * @returns void
 */
  verDetalleInsumo() {
    if (this.form.get('idInsumo')?.value <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'No se ha especificado un insumo',
        icon: 'error',
      });
      return;
    }
    this._existencias
      .existenciaYAlmacenDeInsumo(
        this.idEmpresaInput,
        this.form.get('idInsumo')?.value,
        this.idProyecto
      )
      .subscribe((datos) => {
        if (datos.estatus) {
          Swal.fire({
            title: 'Insumo encontrado',
            text: datos.descripcion,
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'Informacion insumo',
            text: datos.descripcion,
            icon: 'success',
          });
        }
      });
  }

  handleClick(id: number) {
    this.EliminarInsumoXRequisicion(id);
  }

  EliminarInsumoXRequisicion(idInsumoXRequisicion: number) {
    this._InsumosXRequisicion
      .EliminarInsumoXRequisicion(this.idEmpresaInput, idInsumoXRequisicion)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.isEliminado = true;
          this.cargarRegistros();

          this.lanzarAlerta(
            AlertaTipo.delete,
            'Insumo eliminado correctamente'
          );
        } else {
          Swal.fire({
            text: datos.descripcion,
            icon: 'error',
          });
        }

        this.isEliminado = false;
      });
  }

  abrirText(insumoXR: insumoXRequisicionDTO) {
    this.descripcion = 'Observaciones del insumo';
    this.observacion = insumoXR.observaciones;
    this.insumoXREditado = insumoXR;
    this.testInput.nativeElement.style.display = 'flex';
  }

  editaObservacionTextArea() {
    this.lanzarAlerta(this.alertaTipo.edit, 'Insumo actualizado');
    this.descripcion = '';
    this.insumoXREditado.observaciones = this.observacion;
    this.testInput.nativeElement.style.display = 'none';
    this.actualizarIXR(this.insumoXREditado);
  }

  actualizarIXR(insumoXR: insumoXRequisicionDTO) {
    this._InsumosXRequisicion
      .EditarInsumoXRequisicion(this.idEmpresaInput, insumoXR)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.cargarRegistros();
          this.testInput.nativeElement.style.display = 'none';

          this.lanzarAlerta(this.alertaTipo.edit, 'Insumo actualizado');
        } else {
          Swal.fire({
            text: datos.descripcion,
            icon: 'error',
          });
        }
      });
  }


  selectionChangeInsumo(event: MatAutocompleteSelectedEvent) {
    const SelectedInsumo = event.option.value;
    this.insumoControl.setValue(SelectedInsumo);
    const existeInsumo = this.explocionInsumosparaRequisicion.filter(
      (e) => e.descripcion === SelectedInsumo
    );
    if (existeInsumo.length > 0) {
      this.form.get('idInsumo')?.setValue(existeInsumo[0].id);
      this.form.get('unidad')?.setValue(existeInsumo[0].unidad);
      this.form.get('idTipoInsumo')?.setValue(existeInsumo[0].idTipoInsumo);
      this.form.get('cUnitario')?.setValue(existeInsumo[0].costoUnitario);
      this.form.get('cPresupuestada')?.setValue(existeInsumo[0].cantidad);
      this.form.get('descripcion')?.setValue(existeInsumo[0].descripcion);
    }
    //  this._existencias
    //   .existenciaYAlmacenDeInsumo(
    //     this.idEmpresaInput,
    //     this.form.get('idInsumo')?.value,
    //     this.idProyecto
    //   )
    //   .subscribe((datos) => {
    //     console.log(datos);
        
    //     if (datos.estatus) {
    //       Swal.fire({
    //         title: 'Insumo encontrado',
    //         text: datos.descripcion,
    //         icon: 'success',
    //       });
    //     } else {
    //       Swal.fire({
    //         title: 'Informacion insumo',
    //         text: datos.descripcion,
    //         icon: 'success',
    //       });
    //     }
    //   });
    this.consultarCantidad();
  }


  prueba(event: any) {
    const filterValue = String(this.insumoControl.value).toLocaleLowerCase();
    let uwu = this.explocionInsumosparaRequisicion.filter((insumo) => (insumo.descripcion.toLocaleLowerCase().includes(filterValue)) || (insumo.descripcion.toLocaleLowerCase().includes(String(filterValue))));
    this.explocionInsumosparaRequisicion = uwu;
  }

  // traerInformacion(event: Event) {
  //     const existeProyecto = this.proyectos.filter(
  //       (z) => z.nombre === this.textoDataList.nativeElement.value
  //     );
  //     if (existeProyecto.length > 0) {
  //       const inputElement = event.target as HTMLInputElement;
  //       const selectedValue = inputElement.value;
  //       const idProyecto =
  //         this.proyectos.find((proyecto) => proyecto.nombre === selectedValue)
  //           ?.id || 0;
  //       if (idProyecto > 0) {
  //         this.zvSeguridadService.guardarIdProyectoLocalStorage(idProyecto);
  //         this.recargar = this.recargar + 1;
  //         this.proyectoIdChange = idProyecto;
  //         let idEmpresa = Number(this.selectedEmpresa);
  //         let nuevoRegistro: usuarioUltimaSeccion = {
  //           id: this.idTableUltimoRegistro,
  //           idProyecto: this.proyectoIdChange,
  //           idEmpresa: idEmpresa,
  //           idUsuario: this.idUsuario,
  //         };
  //         this._UsuarioXIdUsuario
  //           .editarUltimaSeccionUsuario(nuevoRegistro)
  //           .subscribe((datos) => {});
  //         this.recargar++;
  //       }
  //     }
  //   }


  filtrarInsumos(event: any) {
    let texto = event.target.value;
    this.descripcionInsumo = texto;

    this.filteredExplosion = this.explosionControl.valueChanges.pipe(
      startWith(texto),
      map(value => {
        
        const stringValue = typeof value === 'string' ? value : '';
        return this._filter(stringValue);
      })

      
    );
    this.form.get("descripcion")?.setValue(texto);
    console.log("cambiando el valor", texto);
  }

  private _filter(value: string): InsumoParaExplosionDTO[] {
    const filterValue = this._normalizeValue(String(value));


    return this.explocionInsumosparaRequisicion.filter(explosion =>
      this._normalizeValue(explosion.descripcion).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    if (value == null) {
      value = "";
    }
    return value.toLowerCase().replace(/\s/g, '');
  }

}
