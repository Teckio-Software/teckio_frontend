import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CuentaContableService } from 'src/app/contabilidad/cuenta-contable/cuenta-contable.service';
import { cuentaContableDTO } from 'src/app/contabilidad/cuenta-contable/tsCuentaContable';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { ContratistaService } from '../contratista.service';
import { contratistaDTO } from '../tsContratista';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { clienteDTO } from '../../cliente/tsCliente';
import { ClienteService } from '../../cliente/cliente.service';
import { CuentabancariaEmpresaService } from 'src/app/bancos/cuentabancaria/cuentabancaria-empresa/cuentabancaria-empresa.service';
import { CuentaBancariaEmpresaDTO } from 'src/app/bancos/cuentabancaria/cuentabancaria';

@Component({
  selector: 'app-modal-contratista-cuentascontables',
  templateUrl: './modal-contratista-cuentascontables.component.html',
  styleUrls: ['./modal-contratista-cuentascontables.component.css']
})
export class ModalContratistaCuentascontablesComponent {
  cuentaControl = new FormControl("")
  filteredCuentas: Observable<cuentaContableDTO[]> = new Observable<cuentaContableDTO[]>();

  selectedEmpreaa: number = 0;
  cuentasContables: cuentaContableDTO[] = [];
  cuentaSeleccionada: cuentaContableDTO = {
    id: 0,
    codigo: '',
    descripcion: '',
    idRubro: 0,
    descripcionRubro: '',
    tipoMoneda: 0,
    saldoInicial: 0,
    saldoFinal: 0,
    presupuesto: 0,
    idCodigoAgrupadorSat: 0,
    descripcionCodigoAgrupadorSat: '',
    idPadre: 0,
    nivel: 0,
    existeMovimiento: false,
    existePoliza: false,
    expandido: false,
    seleccionado: false,
    hijos: [],
    tipoCuentaContableDescripcion: '',
    esCuentaContableEmpresa: false,
    tipoCuentaContable: 0
  }

  contratista: contratistaDTO = {
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

  cliente: clienteDTO = {
    id: 0,
    razonSocial: '',
    rfc: '',
    email: '',
    telefono: '',
    representanteLegal: '',
    domicilio: '',
    noExterior: '',
    colonia: '',
    municipio: '',
    codigoPostal: '',
    idCuentaContable: 0,
    idIvaTrasladado: 0,
    idIvaPorTasladar: 0,
    idCuentaAnticipos: 0,
    idIvaExento: 0,
    idIvaGravable: 0,
    idRetensionIsr: 0,
    idIeps: 0,
    idIvaRetenido: 0,
    direccion: ''
  }

  cuentaBancariaEmpresa : CuentaBancariaEmpresaDTO = {
    id: 0,
    idBanco: 0,
    numeroCuenta: '',
    numeroSucursal: '',
    clabe: '',
    cuentaClabe: '',
    tipoMoneda: 0,
    fechaAlta: new Date,
    nombreBanco: '',
    idCuentaContable: 0,
    existeCuentaContable: false
  }

  cuentaTipo: number = 0;
  esContratista = false;
  esCliente = false;
  esCuentaBancariaEmpresa = false;

  constructor(
    public dialogRef: MatDialogRef<ModalContratistaCuentascontablesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _SeguridadService: SeguridadService,
    private _cuentacontableServiece: CuentaContableService,
    private _contratistaService: ContratistaService,
    private _clienteService: ClienteService,
    private _cuentaBancariaEmpresa : CuentabancariaEmpresaService
  ) {
    let NumeroEmpresa = _SeguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpreaa = Number(NumeroEmpresa);
  }

  private _filter(value: string): cuentaContableDTO[] {
    const filterValue = this._normalizeValue(String(value));


    return this.cuentasContables.filter(cuenta =>
      this._normalizeValue(cuenta.descripcion).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  ngOnInit(): void {

    if (this.data.contratista) {
      this.esContratista = true;
    } else if (this.data.cliente) {
      this.esCliente = true;
    } else if (this.data.cuentaBancariaEmpresa) {
      this.esCuentaBancariaEmpresa = true;
    };

    this._cuentacontableServiece.obtenerAsignables(this.selectedEmpreaa).subscribe((datos) => {
      this.cuentasContables = datos;
      this.filteredCuentas = this.cuentaControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const stringValue = typeof value === 'string' ? value : '';
          return this._filter(stringValue);
        })
      );
    });
  }

  filtrarTabla(event: any) {
    let texto = event.target.value;
    this.filteredCuentas = this.cuentaControl.valueChanges.pipe(
      startWith(texto),
      map(value => {
        const stringValue = typeof value === 'string' ? value : '';
        return this._filter(stringValue);
      })
    );
  }

  seleccionTipoCuenta(event: any) {
    this.cuentaTipo = Number(event.target.value);
  }

  asignarCuentaContable() {
    if (this.cuentaSeleccionada.id != 0) {
      if (!this.esCuentaBancariaEmpresa) {
        if (this.cuentaTipo != 0) {
          if (this.data.contratista) {
            this.esContratista = true;
            this.contratista = this.data.contratista;
            this.asignarContratistaCuentaContable();
          } else if (this.data.cliente) {
            this.esCliente = true;
            this.cliente = this.data.cliente;
            this.asignarClienteCuentaContable();
          };
        } else {
          console.log("No se ha seleccionado el tipo de cuenta");
        }
      }else{
        this.asignarCuantaContableEmpresa();
      }
    } else {
      console.log("No se ha seleccionado una cuenta");
    }
  }

  asignarContratistaCuentaContable() {

    switch (this.cuentaTipo) {
      case 1:
        this.contratista.idCuentaContable = this.cuentaSeleccionada.id;
        break;
      case 2:
        this.contratista.idIvaAcreditableContable = this.cuentaSeleccionada.id;
        break;
      case 3:
        this.contratista.idIvaPorAcreditar = this.cuentaSeleccionada.id;
        break;
      case 4:
        this.contratista.idCuentaAnticipos = this.cuentaSeleccionada.id;
        break;
      case 5:
        this.contratista.idCuentaRetencionISR = this.cuentaSeleccionada.id;
        break;
      case 6:
        this.contratista.idCuentaRetencionIVA = this.cuentaSeleccionada.id;
        break;
      case 7:
        this.contratista.idEgresosIvaExento = this.cuentaSeleccionada.id;
        break;
      case 8:
        this.contratista.idEgresosIvaGravable = this.cuentaSeleccionada.id;
        break;
      case 9:
        this.contratista.idIvaAcreditableFiscal = this.cuentaSeleccionada.id;
        break;
    }

    this._contratistaService.editar(this.contratista, this.selectedEmpreaa).subscribe((datos) => {
      if (datos.estatus) {
        console.log(datos.descripcion);
        this.cerrar();
      } else {
        console.log(datos.descripcion);
      }
    });
  }

  asignarClienteCuentaContable() {

    switch (this.cuentaTipo) {
      case 1:
        this.cliente.idCuentaContable = this.cuentaSeleccionada.id;
        break;
      case 2:
        this.cliente.idIvaTrasladado = this.cuentaSeleccionada.id;
        break;
      case 3:
        this.cliente.idIvaPorTasladar = this.cuentaSeleccionada.id;
        break;
      case 4:
        this.cliente.idCuentaAnticipos = this.cuentaSeleccionada.id;
        break;
      case 5:
        this.cliente.idIvaExento = this.cuentaSeleccionada.id;
        break;
      case 6:
        this.cliente.idIvaGravable = this.cuentaSeleccionada.id;
        break;
      case 7:
        this.cliente.idRetensionIsr = this.cuentaSeleccionada.id;
        break;
      case 8:
        this.cliente.idIeps = this.cuentaSeleccionada.id;
        break;
      case 9:
        this.cliente.idIvaRetenido = this.cuentaSeleccionada.id;
        break;
    }

    this._clienteService.editar(this.selectedEmpreaa, this.cliente).subscribe((datos) => {
      if (datos.estatus) {
        console.log(datos.descripcion);
        this.cerrar();
      } else {
        console.log(datos.descripcion);
      }
    });
  }

  asignarCuantaContableEmpresa(){
    this.cuentaBancariaEmpresa.id = this.data.cuentaBancariaEmpresa.id;
    this.cuentaBancariaEmpresa.idCuentaContable = this.cuentaSeleccionada.id;

    this._cuentaBancariaEmpresa.AsignarCuentaContable(this.selectedEmpreaa, this.cuentaBancariaEmpresa).subscribe((datos) => {
      if(datos.estatus){
        this.cerrar();
      }
    });
  }

  Seleccionar(cuenta: cuentaContableDTO) {
    this.cuentaSeleccionada = cuenta;
  }

  cerrar() {
    this.dialogRef.close(true);
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
