import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { BancoDTO } from '../tsBanco';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BancoService } from '../banco.service';
import Swal from 'sweetalert2';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.css']
})
export class BancoComponent {
  banco: BancoDTO[] = [];
  bancoReset: BancoDTO[] = [];
  selectedBanco: number = 0;
  form!: FormGroup;
  bancos: BancoDTO = {
    id: 0,
    clave: "",
    nombre: "",
    razonSocial: ""
  };
  @ViewChild('dialogNuevoBanco', { static: true })
  dialogNuevoBancoModal!: TemplateRef<any>;
  // @ViewChild('staticBackdrop')
  // staticBackdrop!: ElementRef;

  selectedEmpresa = 0;

  constructor(private BancoService: BancoService,
    private FormBuilder: FormBuilder,
    private _SeguridadEmpresa: SeguridadService
    , private dialog: MatDialog
  ) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    this.form = this.FormBuilder.group({
      clave: ['', { validators: [], },]
      , nombre: ['', { validators: [], },]
      , razonsocial: ['', { validators: [], },]

    });
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.BancoService.ObtenerBancos(this.selectedEmpresa).subscribe((datos) => {
      this.banco = datos;
      this.bancoReset = datos;
    })
  }

  BancoXCalve(clave: string) {
    this.BancoService.ObtenerXClave(clave).subscribe((datos) => {
      this.bancos = datos;
    })
  }


  eliminarBanco(id: number) {
    this.BancoService.EliminarBanco(this.selectedEmpresa, id).subscribe((datos) => {
      if (datos.estatus) {
      this.cargarRegistros();
      }
      else {
        Swal.fire({
          title: "Error",
          text: datos.descripcion,
          icon: "error"
        });
      }
    })
  }

  crearBanco() {
    this.bancos.clave = this.form.get("clave")?.value;
    this.bancos.nombre = this.form.get("nombre")?.value;
    this.bancos.razonSocial = this.form.get("razonsocial")?.value;

    if (this.bancos.clave == "" || typeof this.bancos.clave == 'undefined' ||
      this.bancos.nombre == "" || typeof this.bancos.nombre == 'undefined' ||
      this.bancos.razonSocial == "" || typeof this.bancos.razonSocial == 'undefined'
    ) {
      Swal.fire({
        title: "Error",
        text: "Capture todos los datos.",
        icon: "error"
      });
    } else {
      if (this.selectedBanco <= 0) {
        this.BancoService.GuardarBanco(this.selectedEmpresa, this.bancos).subscribe((datos) => {
          if (datos.estatus) {
            this.cargarRegistros();
            this.limpiarFormulario();
          }
          else {
            Swal.fire({
              title: "Error",
              text: datos.descripcion,
              icon: "error"
            });
          }
        })
      } else {
        this.bancos.id = this.selectedBanco;
        this.BancoService.EditarBanco(this.selectedEmpresa, this.bancos).subscribe((datos) => {
          if (datos.estatus) {
            this.cargarRegistros();
            this.limpiarFormulario();
          }
          else {
            Swal.fire({
              title: "Error",
              text: datos.descripcion,
              icon: "error"
            });
          }
        })
      }

    }


  }

  obtenerinfobanco(banco: BancoDTO) {
    this.form.get("clave")?.setValue(banco.clave);
    this.form.get("nombre")?.setValue(banco.nombre);
    this.form.get("razonsocial")?.setValue(banco.razonSocial);

    this.selectedBanco = banco.id;
    this.openDialogWithoutRef();
  }

  openDialogWithoutRef() {
    this.dialog.open(this.dialogNuevoBancoModal, {
      width: '50%',
      disableClose: true
    });
  }

  limpiarFormulario() {
    this.form.reset();
    this.selectedBanco = 0;
    this.bancos.id = 0;
    this.bancos.clave = "";
    this.bancos.nombre = "";
    this.bancos.razonSocial = "";
    this.dialog.closeAll();
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

}
