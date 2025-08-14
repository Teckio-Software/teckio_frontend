import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AlmacenService } from '../almacen.service';
import { MatTable } from '@angular/material/table';
import { almacenCreacionDTO, almacenDTO } from '../almacen';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { EmpresaService } from 'src/app/catalogos/empresas/empresa.service';

@Component({
    selector: 'app-almacen',
    templateUrl: './almacen.component.html',
    styleUrls: ['./almacen.component.css']
})

export class AlmacenComponent implements OnInit {
    @ViewChild('NuevoAlmacen', { static: true })
    dialogNuevoAlmacen!: TemplateRef<any>;
    proyectos!: proyectoDTO[];
    proyectoSeleccionado !: boolean;
    idProyecto: number = 0;
    form!: FormGroup;
    ideditaAlmacen: number = 0;
    selectedEmpresa: number = 0;

    panelActivado: boolean = false;
    constructor(private almacenService: AlmacenService
        , private empresaService: EmpresaService
        , private _SeguridadEmpresa: SeguridadService
        , private _snackBar: MatSnackBar
        , private formBuilder: FormBuilder
        , private proyectoService: ProyectoService
        , private dialog: MatDialog
    ) {
        let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
        let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
        this.idProyecto = Number(idProyecto);
    this.selectedEmpresa = Number(idEmpresa);
    }

    @ViewChild('table')
    table?: MatTable<any>;
    almacenes!: almacenDTO[];
    nuevoalmacen : almacenDTO = {
        id: 0,
        codigo: '',
        almacenNombre: '',
        central: false,
        responsable: '',
        domicilio: '',
        colonia: '',
        ciudad: '',
        telefono: '',
        idProyecto: 0
    }
    almacen: almacenCreacionDTO = {
        codigo: '',
        almacenNombre: '',
        central: false,
        responsable: '',
        domicilio: '',
        colonia: '',
        ciudad: '',
        telefono: '',
        idProyecto: 0
    };

    ngOnInit(): void {
        this.traerInformacion();
        this.proyectoService.obtener(this.selectedEmpresa).subscribe((datos) => {
            this.proyectos = datos;
        })
        this.form = this.formBuilder.group({
            id: [0, { validators: [], },]
            , codigo: ['', { validators: [], },]
            , almacenNombre: ['', { validators: [], },]
            , central: ['', { validators: [], },]
            , responsable: ['', { validators: [], },]
            , domicilio: ['', { validators: [], },]
            , colonia: ['', { validators: [], },]
            , ciudad: ['', { validators: [], },]
            , telefono: ['', { validators: [], },]
            , idProyecto: [0, { validators: [], },]
        });
    }

    traerInformacion(
    ) {


        this.proyectoSeleccionado = true;

        this.almacenService.obtenerXIdProyecto(this.idProyecto, this.selectedEmpresa).subscribe((datos) => {
            this.almacenes = datos;
        });
    }

    openDialogWithoutRef() {
        this.dialog.open(this.dialogNuevoAlmacen, {
            width: '50%',
            disableClose: true
        });
    }

    guardar() {
        this.almacen.codigo = this.form.get("codigo")?.value;
        this.almacen.almacenNombre = this.form.get("almacenNombre")?.value;
        this.almacen.central = this.form.get("central")?.value;
        this.almacen.responsable = this.form.get("responsable")?.value;
        this.almacen.domicilio = this.form.get("domicilio")?.value;
        this.almacen.colonia = this.form.get("colonia")?.value;
        this.almacen.ciudad = this.form.get("ciudad")?.value;
        this.almacen.telefono = this.form.get("telefono")?.value;
        this.almacen.idProyecto = this.almacen.central? null:  this.idProyecto;
        if (typeof this.almacen.codigo === 'undefined' || !this.almacen.codigo || this.almacen.codigo === "" ||
            typeof this.almacen.almacenNombre === 'undefined' || !this.almacen.almacenNombre || this.almacen.almacenNombre === "" ||
            typeof this.almacen.responsable === 'undefined' || !this.almacen.responsable || this.almacen.responsable === "" ||
            typeof this.almacen.domicilio === 'undefined' || !this.almacen.domicilio || this.almacen.domicilio === "" ||
            typeof this.almacen.colonia === 'undefined' || !this.almacen.colonia || this.almacen.colonia === "" ||
            typeof this.almacen.ciudad === 'undefined' || !this.almacen.ciudad || this.almacen.ciudad === "" ||
            typeof this.almacen.telefono === 'undefined' || !this.almacen.telefono || this.almacen.telefono === ""
        ) {
            Swal.fire({
                title: "Error",
                text: "Capture la información correctamente",
                icon: "error"
              });
            return;
        }
        if (typeof this.almacen.central === 'undefined' || !this.almacen.central) {
            this.almacen.central = false;
        }
        console.log("valor de id", this.form.get("id")?.value);
        if(this.form.get("id")?.value == 0){
            this.almacenService.crear(this.almacen, this.selectedEmpresa).subscribe((datos) => {
                if(datos.estatus){
                    this.limpiarFormulario();
                    this.traerInformacion();
                }else{
                    Swal.fire({
                        title: "Error",
                        text: "No se creo el amacén",
                        icon: "error"
                      });
                }
            })
        }else{
            this.nuevoalmacen = this.form.getRawValue();
            this.almacenService.editar(this.nuevoalmacen, this.selectedEmpresa).subscribe((datos) => {
                if(datos.estatus){
                    this.limpiarFormulario();
                    this.traerInformacion();
                }else{
                    Swal.fire({
                        title: "Error",
                        text: "No se edito el amacén",
                        icon: "error"
                      });
                }
            })
        }
        this.form.reset();
        this.form.get("id")?.setValue(0);
        this.ideditaAlmacen = 0;
    }

    limpiarFormulario() {
        this.form.reset();
        this.form.get("id")?.setValue(0);
        this.ideditaAlmacen = 0;
        this.dialog.closeAll();
    }

    detenerCierre(event: MouseEvent) {
        event.stopPropagation();
    }

    editar(almacen:almacenDTO){
        this.form.setValue(almacen);
        this.openDialogWithoutRef();
    }
}
