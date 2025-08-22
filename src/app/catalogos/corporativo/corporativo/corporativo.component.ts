import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { UtilidadesService } from 'src/app/utilidades/utilidades.service';
import { CorporativoService } from '../corporativo.service';
import { ModalCorporativoComponent } from '../modal-corporativo/modal-corporativo.component';
import { Corporativo } from '../../empresas/empresa';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { corporativo } from 'src/app/seguridad/usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { UsuarioCorporativoService } from 'src/app/seguridad/Servicios/usuario-corporativo.service';



@Component({
  selector: 'app-corporativo',
  templateUrl: './corporativo.component.html',
  styleUrls: ['./corporativo.component.css']
})
export class CorporativoComponent implements OnInit {
  columnasTabla: string[] = ['nombre', 'estado', 'acciones'];

  dataInicio: corporativo[] = [];
  dataListaCorporativos = new MatTableDataSource(this.dataInicio);
  dataListaCorporativos2 : corporativo[] = [];
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  isLoading: boolean = true;

  constructor(
    private dialog: MatDialog,
    private _corporativoServicio: CorporativoService,
    private _UsuarioCorporativoService: UsuarioCorporativoService,
    private _utilidadServicio: UtilidadesService
  ) {}

  obtenerCorporativos() {
    this._UsuarioCorporativoService.obtenCorporativosPertenecientes().subscribe({
      next: (data) => {
        this.dataListaCorporativos2 = data;
        this.isLoading = false;
      },
      error: (e) => {
        console.log;
      },
    });
  }

  ngOnInit(): void {
    this.obtenerCorporativos();
  }

  ngAfterViewInit(): void {
    this.dataListaCorporativos.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.dataListaCorporativos2 = this.dataListaCorporativos2.filter(corporativo =>
      corporativo.nombre.toLocaleLowerCase().includes(filterValue)
    );
  }
  nuevoCorporativo() {
    this.dialog
      .open(ModalCorporativoComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado == 'true') this.obtenerCorporativos();
      });
  }

  editarCorporativo(corporativo: Corporativo) {
    console.log(corporativo);
    this.dialog
      .open(ModalCorporativoComponent, {
        disableClose: true,
        data: corporativo,
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado == 'true') this.obtenerCorporativos();
      });
  }

  eliminarCorporativo(corporativo: Corporativo) {
    Swal.fire({
      title: '¿Desea eliminar el corporativo?',
      text: corporativo.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._corporativoServicio.eliminar(corporativo.id).subscribe({
          next: (data) => {
            if (data.status) {
             
              this.obtenerCorporativos();
            }
          },
          error: (e) => {},
        });
      }
    });
  }
}
