import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ProyectoService } from '../../proyecto/proyecto.service';
import { proyectoDTO } from '../../proyecto/tsProyecto';
import { pruebaDTO } from 'src/app/contabilidad/cuenta-contable/tsCuentaContable';
import { ContratoService } from '../contratos.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { contratoDTO, destajistasXConceptoDTO, detalleXContratoDTO, detalleXContratoParaTablaDTO, parametrosParaBuscarContratos } from '../tsContratos';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { computeMsgId } from '@angular/compiler';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css'],
  providers: [NgbTooltip] // Agrega NgbTooltip en la lista de providers

})
export class ContratosComponent implements OnInit {
  @ViewChild('tooltipContent') tooltipContent!: any;
  @ViewChild(NgbTooltip) tooltip!: NgbTooltip; // Inicialización de la propiedad tooltip

  selectedStatus!: number;
  selectedProyecto: number = 0;
  nombreDestajo: string = '';
  proyectos: proyectoDTO[] = [];
  contratos: contratoDTO[] = [];
  contratistas: contratistaDTO[] = [];
  contratistasReset: contratistaDTO[] = [];
  detallesContrato: detalleXContratoParaTablaDTO[] = [];
  selectedEmpresa: number = 0;
  selectedContrato: number = 0;
  contratoBloqueado: boolean = false;
  selectedContratista: number = 0;
  esDestajoOContrato: boolean = false;
  seEstaEditandoDestajo: boolean = false;
  contratistaNombre = "";
  contratoSeleccionado = 0;
  estatusContrato = 0;
  destajistaXConcepto: destajistasXConceptoDTO[] = [];
  displayCarga: string = 'none';

  cantidaPorcentajeAnterior : number = 0;

  constructor(private proyectoService: ProyectoService
    , private contratosService: ContratoService
    , private seguridadService: SeguridadService
    , private contratistaService: ContratistaService
  ) {
    let idEmpresa = seguridadService.obtenIdEmpresaLocalStorage();
    let idProyecto = seguridadService.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(idProyecto);
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    this.proyectoService.obtener(this.selectedEmpresa)
      .subscribe((proyectos) => this.proyectos = proyectos);
    this.contratistaService.obtenerTodos(this.selectedEmpresa)
      .subscribe((contratistas) => {
        this.contratistasReset = contratistas;
        this.contratistas = contratistas.filter(z => z.esProveedorMaterial == true && z.esProveedorServicio == true);
      })
  }

  onSelectionChange(): void {
    if (this.selectedContratista != 0) {
      let parametros: parametrosParaBuscarContratos = {
        idProyecto: this.selectedProyecto,
        tipoContrato: this.esDestajoOContrato,
        idContratista: this.selectedContratista,
        idContrato: 0,
        fechaInicio: null,
        fechaFin: null
      }
      this.contratosService.obtenerDestajos(parametros, this.selectedEmpresa)
        .subscribe((contratos) => {
          this.contratos = contratos
        })
    }
    this.registroEditado.porcentajeDestajoEditando = false;
    this.seEstaEditandoDestajo = false;
    this.detallesContrato = [];
    this.contratoSeleccionado = 0;
    this.contratos = [];
  }


  onSelectionChangeSelect(event: Event): void {
    const inputElement = event.target as HTMLSelectElement;
    const selectedValue = inputElement.value;
    console.log("valro selected", selectedValue);
    const selectedContrato = this.contratos.find(z => z.numeroDestajoDescripcion.replace(/ /g, "") == selectedValue.replace(/ /g, ""));
    if (selectedContrato) {
      this.displayCarga = 'flex';

      this.selectedContrato = selectedContrato.id;
      this.contratoBloqueado = selectedContrato.estatus == 3 ? true : false;
      this.contratosService.obtenerDetallesDestajos(this.selectedContrato, this.selectedEmpresa)
        .subscribe((registros) => {
          this.detallesContrato = registros;
          this.displayCarga = 'none';
        })
      this.estatusContrato = selectedContrato?.estatus;
    }
    this.registroEditado.porcentajeDestajoEditando = false;
    this.seEstaEditandoDestajo = false;
    this.detallesContrato = [];
    this.contratoSeleccionado = 0;
  }

  onSelectionChangeDestajos(event: Event): void {
    const inputElement = event.target as HTMLSelectElement;
    const selectedValueNombreDestajo = inputElement.value;

    // Limpia o restablece las variables necesarias aquí
    this.limpiarDatos();

    // Después de limpiar, asigna el nuevo valor de nombreDestajo
    this.nombreDestajo = selectedValueNombreDestajo;

    // Actualiza contratistas basado en la selección
    if (this.nombreDestajo === 'Subcontratistas') {
      this.contratistas = this.contratistasReset.filter(z => z.esProveedorMaterial === true && z.esProveedorServicio === true);
      this.esDestajoOContrato = false;
    } else if (this.nombreDestajo === 'Destajo') {
      this.contratistas = this.contratistasReset.filter(z => z.esProveedorServicio == true);
      this.esDestajoOContrato = true;
    }
    this.selectedContratista = 0;
    this.selectedContrato = 0;
    this.seEstaEditandoDestajo = false;
    this.contratistaNombre = "";
    this.registroEditado.porcentajeDestajoEditando = false;
    this.seEstaEditandoDestajo = false;
    this.contratoSeleccionado = 0;
    this.contratos = [];
  }

  // Método para limpiar o restablecer datos
  limpiarDatos(): void {
    this.nombreDestajo = ''; // Restablece nombreDestajo
    this.contratistas = []; // Reinicia la lista de contratistas
    this.esDestajoOContrato = false; // Restablece a un valor booleano inicial

    // Añade aquí cualquier otra variable que necesites limpiar o restablecer
    // Por ejemplo:
    // this.algunOtroEstado = false; // Si tienes otros estados booleanos
    // this.otraSeleccion = null; // Si tienes otras selecciones
    // this.algunObjeto = { propiedad1: '', propiedad2: 0 }; // Si tienes objetos

    // Si usas formularios reactivos, restablece el formulario
    // if (this.miFormulario) {
    //   this.miFormulario.reset();
    // }
  }

  // Función para manejar el cambio de estado
  onStatusChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedStatus = Number(selectedValue);
    // Aquí puedes realizar cualquier acción adicional necesaria con el nuevo estado seleccionado
  }

  Finiquitar() {
    if (this.selectedContrato == 0) {
      return;
    }
    let parametrosFiniquitar: parametrosParaBuscarContratos = {
      idProyecto: this.selectedProyecto,
      tipoContrato: this.esDestajoOContrato,
      idContratista: this.selectedContratista,
      idContrato: this.selectedContrato,
      fechaInicio: null,
      fechaFin: null
    }
    this.displayCarga = 'flex';

    this.contratosService.FiniquitarXContrato(parametrosFiniquitar, this.selectedEmpresa).subscribe((datos) => {
      if (datos.estatus) {
        this.contratoBloqueado = true;
        this.contratos.forEach((element) => {
          if (element.id == this.selectedContrato) {
            element.estatus = 1;
          }
        });
        this.contratosService.obtenerDetallesDestajos(this.selectedContrato, this.selectedEmpresa)
          .subscribe((registros) => {
            this.detallesContrato = registros;
          })
      } else {
        console.log(datos.descripcion);
      }
      this.displayCarga = 'none';
    });
  }

  NewDestajo() {
    if (this.selectedProyecto != 0 && this.selectedContratista != 0) {
      this.displayCarga = 'flex';

      let nuevoContrato: contratoDTO = {
        id: 0,
        tipoContrato: this.esDestajoOContrato,
        numeroDestajo: 0,
        estatus: 0,
        idProyecto: this.selectedProyecto,
        costoDestajo: 0,
        idContratista: this.selectedContratista,
        fechaRegistro: new Date,
        numeroDestajoDescripcion: ''
      }
      this.contratosService.crearContratoDestajo(nuevoContrato, this.selectedEmpresa)
        .subscribe(() => {
          if (this.selectedProyecto != 0) {
            let parametros: parametrosParaBuscarContratos = {
              idProyecto: this.selectedProyecto,
              tipoContrato: this.esDestajoOContrato,
              idContratista: this.selectedContratista,
              idContrato: 0,
              fechaInicio: null,
              fechaFin: null
            }
            this.contratosService.obtenerDestajos(parametros, this.selectedEmpresa)
              .subscribe((contratos) => {
                this.contratos = contratos
              })
          }
          this.displayCarga = 'none';
        });

    }
    this.registroEditado.porcentajeDestajoEditando = false;
    this.seEstaEditandoDestajo = false;
  }


  onSelectionSeleccionContratista(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    console.log(selectedValue);

    //  si uri quiere ver el proyecto seleccionado completo
    const selectedContratista = this.contratistas.find(z => z.razonSocial.replace(/ /g, "") == selectedValue.replace(/ /g, ""));
    console.log(this.contratistas);
    if (selectedContratista) {
      console.log("eeeeee")
      this.displayCarga = 'flex';

      this.selectedContratista = selectedContratista.id;
      let parametros: parametrosParaBuscarContratos = {
        idProyecto: this.selectedProyecto,
        tipoContrato: this.esDestajoOContrato,
        idContratista: this.selectedContratista,
        idContrato: 0,
        fechaInicio: null,
        fechaFin: null
      }
      this.contratosService.obtenerDestajos(parametros, this.selectedEmpresa)
        .subscribe((contratos) => {
          this.contratos = contratos;
          this.displayCarga = 'none';
        })
    }
    this.registroEditado.porcentajeDestajoEditando = false;
    this.seEstaEditandoDestajo = false;
    this.detallesContrato = [];
    this.contratos = [];
  }

  expansionDominio(detalle: detalleXContratoParaTablaDTO): void {
    detalle.expandido = !detalle.expandido;
  }

  registroEditado: detalleXContratoParaTablaDTO = {
    idDetalleXContrato: 0,
    idPrecioUnitario: 0,
    codigo: '',
    descripcion: '',
    unidad: '',
    costoUnitario: 0,
    costoUnitarioConFormato: '',
    cantidad: 0,
    cantidadConFormato: '',
    importe: 0,
    importeConFormato: '',
    tipoPrecioUnitario: 0,
    idPrecioUnitarioBase: 0,
    idContrato: 0,
    porcentajeDestajo: 0,
    porcentajeDestajoConFormato: '',
    porcentajeDestajoEditando: false,
    importeDestajo: 0,
    importeDestajoConFormato: '',
    porcentajeDestajoAcumulado: 0,
    porcentajeDestajoAcumuladoConFormato: '',
    expandido: false,
    hijos: [],
    factorDestajo: 0,
    factorDestajoConFormato: '',
    aplicarPorcentajeDestajoHijos: false
  }

  habilitarEdicion(contrato: detalleXContratoParaTablaDTO) {
    console.log("aqui ando click");
    if (this.contratoBloqueado) {
      console.log("esta bloquedo");
      return;
    }
    if (contrato.idDetalleXContrato == 0) {
      this.cantidaPorcentajeAnterior = contrato.porcentajeDestajo;
      contrato.porcentajeDestajoEditando = true;
      this.registroEditado.porcentajeDestajoEditando = false;
      this.registroEditado = contrato;
      return;
    }

    if (this.registroEditado.idDetalleXContrato != contrato.idDetalleXContrato) {
      this.cantidaPorcentajeAnterior = contrato.porcentajeDestajo;
      contrato.porcentajeDestajoEditando = true;
      this.registroEditado.porcentajeDestajoEditando = false;
      this.registroEditado = contrato;
    } else {
      this.cantidaPorcentajeAnterior = contrato.porcentajeDestajo;
      contrato.porcentajeDestajoEditando = true;
      this.registroEditado = contrato;
    }

    // this.registroEditado = contrato;
    // contrato.porcentajeDestajoEditando = true;

    // if (this.seEstaEditandoDestajo == false) {
    //   this.seEstaEditandoDestajo = true;
    //   if(this.contratoBloqueado == true){
    //   contrato.porcentajeDestajoEditando = false;
    //   }else{
    //     contrato.porcentajeDestajoEditando = true;
    //   }
    //   this.registroEditado = contrato;
    // }
  }

  asignarPorcentaje(contrato: detalleXContratoParaTablaDTO) {
    this.displayCarga = 'flex';

    this.seEstaEditandoDestajo = false;
    contrato.porcentajeDestajoEditando = false;
    console.log("este es el porcentaje CE", this.cantidaPorcentajeAnterior);
    console.log("este es el porcentaje C", contrato.porcentajeDestajo);

    if(contrato.porcentajeDestajo != this.cantidaPorcentajeAnterior){
      contrato.aplicarPorcentajeDestajoHijos = true;
    }
    this.contratosService.crearOEditarDetalle(contrato, this.selectedEmpresa)
      .subscribe(() => {
        this.contratosService.obtenerDetallesDestajos(this.selectedContrato, this.selectedEmpresa)
          .subscribe((registros) => {
            this.detallesContrato = registros;
          });
        this.displayCarga = 'none';

      });
    this.displayCarga = 'none';

    this.registroEditado.porcentajeDestajoEditando = false;
    this.seEstaEditandoDestajo = false;
  }

  @HostListener('document:keydown.Escape', ['$event'])
  quitarSeleccion(): void {
    this.registroEditado.porcentajeDestajoEditando = false;
    this.seEstaEditandoDestajo = false;
  }

  verDestajistas(detalle: detalleXContratoParaTablaDTO) {
    if (detalle.hijos.length <= 0) {
      this.contratosService.ObtenerDestajistasXConcepto(detalle, this.selectedEmpresa).subscribe((datos) => {
        this.destajistaXConcepto = datos;
      });
    }
  }


  openTooltip() {
    this.tooltip.open({ content: this.tooltipContent });
  }

  cerrarTooltip() {

    this.tooltip.close();

  }
}