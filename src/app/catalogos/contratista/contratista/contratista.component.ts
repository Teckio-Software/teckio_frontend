import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ContratistaService } from '../contratista.service';
import { contratistaDTO } from '../tsContratista';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import Swal from 'sweetalert2';
import { CuentaContableService } from 'src/app/contabilidad/cuenta-contable/cuenta-contable.service';
import { cuentaContableDTO } from 'src/app/contabilidad/cuenta-contable/tsCuentaContable';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormularioComponent } from 'src/app/utilidades/contratista/modal-formulario/modal-formulario.component';
import { CuentabancariaContratistaComponent } from 'src/app/bancos/cuentabancaria/cuentabancaria-contratista/cuentabancaria-contratista/cuentabancaria-contratista.component';
import { ModalAlertComponent } from 'src/app/utilidades/modal-alert/modal-alert.component';
import { ConfiguracionCuentaContableModalComponent } from '../configuracion-cuenta-contable-modal/configuracion-cuenta-contable-modal.component';
import { ModalContratistaCuentascontablesComponent } from '../modal-contratista-cuentascontables/modal-contratista-cuentascontables.component';

@Component({
  selector: 'app-contratista',
  templateUrl: './contratista.component.html',
  styleUrls: ['./contratista.component.css']
})
export class ContratistaComponent implements OnInit {
  contratistas!: contratistaDTO[];
  cuentasContables!: cuentaContableDTO[];
  selectedEmpresa: number = 0;
  appRefrescar = 1;
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
  };

  selectedIndex: number = 0;


  idContratista: number = 0;
  contratistaSeleccionado: boolean = false;
  changeColor: any = null;
  /////////* PAGINATION */////////
  paginatedContratista: contratistaDTO[] = [];
  currentPage = 1;
  pageSize = 15; // Number of items per page
  totalItems = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  totalPages = 0;
  /////////* PAGINATION */////////

  estaGuardando = false;


  constructor(private contratistaService: ContratistaService
    , private seguridadService: SeguridadService
    , private cuentaContableService: CuentaContableService
    , public dialog: MatDialog
  ) {
    let idEmpresa = seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    this.cargarContartistas();

    this.cuentaContableService.obtenerTodosSinEstructura(this.selectedEmpresa)
      .subscribe((cuentasContables) => {
        this.cuentasContables = cuentasContables;
      })
  }

  cargarContartistas() {
    this.contratistaService.obtenerTodos(this.selectedEmpresa)
      .subscribe((contratistas) => {
        this.contratistas = contratistas;
        this.totalItems = contratistas.length;
        this.updatePagination();
        this.updatePaginatedData();
      })
  }

  abrirDialogoFormularioGuardar() {
    this.estaGuardando = true;
    this.abrirDialogoFormulario(this.contratista);
  }
  abrirDialogoFormulario(contratista: contratistaDTO): void {
    const dialogRef = this.dialog.open(ModalFormularioComponent, {

      data: {
        contratista: contratista
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.estaGuardando) {
          this.currentPage = this.totalPages;
        }
        this.cargarContartistas();
      }
    })
  }

  abrirModalCBContratista(idContratista: number): void {
    const dialogRef = this.dialog.open(CuentabancariaContratistaComponent, {
      data: {
        idContratista: idContratista
      }
    });
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      this.appRefrescar += 1;
    });

  }

  abrirModalCCContratista(contratista: contratistaDTO): void {
    const dialogRef = this.dialog.open(ModalContratistaCuentascontablesComponent, {
      data: {
        contratista: contratista
      }
    });
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      this.appRefrescar += 1;
    });

  }

  abrirDialogo(idContratista: number): void {
    this.idContratista = idContratista;
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      data: {
        selectedContratista: idContratista,
        titulo: '',
        mensaje: '¿Quieres eliminar el contratista?',
        funcionAceptarContratista: this.eliminarContratista.bind(this),
      }
    });
  }

  eliminarContratista() {
    this.contratistaService.borrar(this.selectedEmpresa, this.idContratista).subscribe((datos) => {
      if (datos.estatus) {
        this.cargarContartistas();
      } else {
        Swal.fire({
          imageUrl: "assets/cancelado.svg",
          // icon: "error",
          confirmButtonText: "Cerrar",
          html: `
          <div>
          <p style="margin : 0px;">No se pudo eliminar el contratista</p>
          </div>
          `,
          imageWidth: 50,
          customClass: {
            icon: 'no-border',
            confirmButton: 'SweetAlert2ConfirmButtonError',
          }
        });
      }
    });
  }

  SeleccionaContratista(idContratista: number) {
    this.changeColor = idContratista;
    this.contratistaSeleccionado = true;
    this.idContratista = idContratista;
    this.appRefrescar += 1;
  }

  /////////* PAGINATION */////////

  updatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateVisiblePages();
  }

  updateVisiblePages() {
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, startPage + 4);

    this.visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    if (this.totalPages < 5) {
      this.visiblePages = this.pages;
    }
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedContratista = this.contratistas.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
      this.updateVisiblePages();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
      this.updateVisiblePages();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
      this.updateVisiblePages();
    }
  }

  getPaginationInfo() {
    return `Página ${this.currentPage} de ${this.totalPages}`;
  }
  ///////////* PAGINATION */////////

  asignarCuentaContable(contratista: contratistaDTO) {
    const dialogRef = this.dialog.open(ConfiguracionCuentaContableModalComponent, {
      data: {
        contratista: contratista
      }
    });
  }

  abrirModalCuentaContableContratista(contratista: contratistaDTO) {
    const dialogRef = this.dialog.open(ConfiguracionCuentaContableModalComponent, {
      data: contratista

    });
  }

  yourFn(event: any) {
    this.selectedIndex = event.index;
  }
}
