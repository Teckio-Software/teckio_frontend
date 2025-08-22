import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { clienteDTO, clienteCreacionDTO } from '../../../catalogos/cliente/tsCliente';
import { ClienteService } from '../../../catalogos/cliente/cliente.service';
import { cuentaContableDTO } from '../../cuenta-contable/tsCuentaContable';
import { CuentaContableService } from '../../cuenta-contable/cuenta-contable.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { CuentaBancariaBaseDTO } from 'src/app/bancos/cuentabancaria/cuentabancaria';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-cliente',
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
    form!: FormGroup;
    selectedCliente: number = 0;
    selectedEmpresa: number = 0;
    clienteCreacion: clienteDTO = {
        id: 0,
        razonSocial: "",
        rfc: "",
        email: "",
        telefono: "",
        representanteLegal: "",
        noExterior: "",
        codigoPostal: "",
        idCuentaContable: 0,
        idIvaTrasladado: 0,
        idCuentaAnticipos: 0,
        idIvaExento: 0,
        idIvaGravable: 0,
        idRetensionIsr: 0,
        idIeps: 0,
        idIvaRetenido: 0,
        domicilio: '',
        colonia: '',
        municipio: '',
        idIvaPorTasladar: 0,
        direccion: ''
    }

    clienteCreacionReset: clienteCreacionDTO = {
        id: 0,
        razonSocial: "",
        rfc: "",
        email: "",
        telefono: "",
        representanteLegal: "",
        formaPago: 0,
        direccion: "",
        noExterior: "",
        codigoPostal: "",
        idCuentaContable: 0,
        idIvaTrasladado: 0,
        idIvaPorTrasladar: 0,
        idCuentaAnticipos: 0,
        idIvaExento: 0,
        idIvaGravable: 0,
        idRetensionIsr: 0,
        idIeps: 0,
        idIvaRetenido: 0,
    }

    clientes!: clienteCreacionDTO[];
    cuentasContables!: cuentaContableDTO[];

    // isLoading: boolean = true;
    
    @ViewChild('staticBackdrop')
    staticBackdrop!: ElementRef;

    columnasAMostrar = ['razonSocial', 'rfc', 'email', 'telefono', 'representanteLegal', 'telefonoRepresentanteLegal', 'emailRepresentanteLegal'];
    constructor(private clienteService: ClienteService
        , private _snackBar: MatSnackBar
        , private formBuilder: FormBuilder
        , private cuentaContableService: CuentaContableService
        , private _SeguridadEmpresa: SeguridadService) {
        let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
        this.selectedEmpresa = Number(idEmpresa);
    }
    ngOnInit(): void {
        this.form = this.formBuilder.group({
            id: ['', { validators: [], },]
            , razonSocial: ['', { validators: [], },]
            , rfc: ['', { validators: [], },]
            , email: ['', { validators: [], },]
            , telefono: ['', { validators: [], },]
            , representanteLegal: ['', { validators: [], },]
            , formaPago: ['', { validators: [], },]
            , direccion: ['', { validators: [], },]
            , noExterior: ['', { validators: [], },]
            , codigoPostal: ['', { validators: [], },]
            , idCuentaContable: ['', { validators: [], },]
            , idIvaTrasladado: ['', { validators: [], },]
            , idIvaPorTrasladar: ['', { validators: [], },]
            , idCuentaAnticipos: ['', { validators: [], },]
            , idIvaExento: ['', { validators: [], },]
            , idIvaGravable: ['', { validators: [], },]
            , idRetensionIsr: ['', { validators: [], },]
            , idIeps: ['', { validators: [], },]
            , idIvaRetenido: ['', { validators: [], },]
        })
        this.cargarRegistros();
        this.cuentaContableService.obtenerTodosSinEstructura(this.selectedEmpresa)
            .subscribe((cuentasContables) => {
                this.cuentasContables = cuentasContables;
            })
    }

    cargarRegistros() {
        this.clienteService.obtenerTodos(this.selectedEmpresa)
            .subscribe((clientes) => {
                this.clientes = clientes;
                // this.isLoading = false;
            });
    }

    formClientes() {
        this.clienteCreacion.razonSocial = this.form.get("razonSocial")?.value;
        this.clienteCreacion.rfc = this.form.get("rfc")?.value;
        this.clienteCreacion.email = this.form.get("email")?.value;
        this.clienteCreacion.telefono = this.form.get("telefono")?.value;
        this.clienteCreacion.representanteLegal = this.form.get("representanteLegal")?.value;
        this.clienteCreacion.noExterior = this.form.get("noExterior")?.value;
        this.clienteCreacion.codigoPostal = this.form.get("codigoPostal")?.value;
        this.clienteCreacion.idCuentaContable = this.form.get("idCuentaContable")?.value;
        this.clienteCreacion.idIvaTrasladado = this.form.get("idIvaTrasladado")?.value;
        this.clienteCreacion.idCuentaAnticipos = this.form.get("idCuentaAnticipos")?.value;
        this.clienteCreacion.idIvaExento = this.form.get("idIvaExento")?.value;
        this.clienteCreacion.idIvaGravable = this.form.get("idIvaGravable")?.value;
        this.clienteCreacion.idRetensionIsr = this.form.get("idRetensionIsr")?.value;
        this.clienteCreacion.idIeps = this.form.get("idIeps")?.value;
        this.clienteCreacion.idIvaRetenido = this.form.get("idIvaRetenido")?.value;

        if (this.clienteCreacion.razonSocial == "" || typeof this.clienteCreacion.razonSocial == 'undefined' ||
            this.clienteCreacion.rfc == "" || typeof this.clienteCreacion.rfc == 'undefined' ||
            this.clienteCreacion.codigoPostal == "" || typeof this.clienteCreacion.codigoPostal == 'undefined'
        ) {
            Swal.fire({
                title: "Error",
                text: "Capture Razon Social, RFC, Direccion y Codigo Postal.",
                icon: "error"
            });
        } else {
            if (this.selectedCliente <= 0) {
                this.clienteService.crear(this.selectedEmpresa, this.clienteCreacion).subscribe((datos) => {
                    if (datos.estatus) {
                        Swal.fire({
                            title: "Correcto",
                            text: datos.descripcion,
                            icon: "success"
                        });
                        this.form.reset();
                    }
                    else {
                        Swal.fire({
                            title: "Error",
                            text: datos.descripcion,
                            icon: "error"
                        });
                    }
                    this.cargarRegistros();
                })
            }else{
                this.clienteCreacion.id = this.selectedCliente;
                this.clienteService.editar(this.selectedEmpresa, this.clienteCreacion).subscribe((datos) => {
                    if (datos.estatus) {
                        Swal.fire({
                            title: "Correcto",
                            text: datos.descripcion,
                            icon: "success"
                        });
                        this.form.reset();
                    }
                    else {
                        Swal.fire({
                            title: "Error",
                            text: datos.descripcion,
                            icon: "error"
                        });
                    }
                    this.cargarRegistros();
                })
            }
        }
        this.selectedCliente = 0;
    }

    obtenerinfocliente(cliente:clienteCreacionDTO){
        this.form.get("razonSocial")?.setValue(cliente.razonSocial);
        this.form.get("rfc")?.setValue(cliente.rfc);
        this.form.get("email")?.setValue(cliente.email);
        this.form.get("telefono")?.setValue(cliente.telefono);
        this.form.get("representanteLegal")?.setValue(cliente.representanteLegal);
        this.form.get("formaPago")?.setValue(cliente.formaPago);
        this.form.get("direccion")?.setValue(cliente.direccion);
        this.form.get("noExterior")?.setValue(cliente.noExterior);
        this.form.get("codigoPostal")?.setValue(cliente.codigoPostal);
        this.form.get("idCuentaContable")?.setValue(cliente.idCuentaContable);
        this.form.get("idIvaTrasladado")?.setValue(cliente.idIvaTrasladado);
        this.form.get("idIvaPorTrasladar")?.setValue(cliente.idIvaPorTrasladar);
        this.form.get("idCuentaAnticipos")?.setValue(cliente.idCuentaAnticipos);
        this.form.get("idIvaExento")?.setValue(cliente.idIvaExento);
        this.form.get("idIvaGravable")?.setValue(cliente.idIvaGravable);
        this.form.get("idRetensionIsr")?.setValue(cliente.idRetensionIsr);
        this.form.get("idIeps")?.setValue(cliente.idIeps);
        this.form.get("idIvaRetenido")?.setValue(cliente.idIvaRetenido);

        this.selectedCliente = cliente.id;
      }

      eliminarCliente(id:number){
        this.clienteService.borrar(this.selectedEmpresa, id).subscribe((datos) =>{
          if (datos.estatus) {
            Swal.fire({
              title: "Correcto",
              text: datos.descripcion,
              icon: "success"
            });
          }
          else{
            Swal.fire({
              title: "Error",
              text: datos.descripcion,
              icon: "error"
            });
          }
          this.cargarRegistros();
        })
      }
}
