import { Component, Input, OnInit } from '@angular/core';
import { ModalFormularioComponent } from '../modal-formulario/modal-formulario.component';
import { MatDialog } from '@angular/material/dialog';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { PageEvent } from '@angular/material/paginator';
import { CuentabancariaContratistaComponent } from 'src/app/bancos/cuentabancaria/cuentabancaria-contratista/cuentabancaria-contratista/cuentabancaria-contratista.component';

@Component({
  selector: 'app-table-contratistas',
  templateUrl: './table-contratistas.component.html',
  styleUrls: ['./table-contratistas.component.css']
})
export class TableContratistasComponent implements OnInit {
  selectedEmpresa = 0;
  length = 20;
  pageEvent!: PageEvent;
  inicioCopia = 0;
  terminoCopia = 20;
  constructor(public dialog: MatDialog
    , private contratistaService: ContratistaService
    , private seguridadService: SeguridadService
  ) {
    let idEmpresa = seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }
  @Input() contratistas!: contratistaDTO[];

  cambiarPaginaCopia(e:PageEvent){
    this.pageEvent = e;
    this.length = e.length;
    this.inicioCopia = e.pageIndex * e.pageSize;
    this.terminoCopia = this.inicioCopia + e.pageSize;
  }

  abrirDialogoFormulario(): void {
    const dialogRef = this.dialog.open(ModalFormularioComponent, {
 
        data: {
        contratistas: this.contratistas,
        titulo: '',
        mensaje: '¿Quieres eliminar el periodo?',    
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.contratistaService.obtenerTodos(this.selectedEmpresa)
        .subscribe((contratistas) => this.contratistas = contratistas)
      }
    })
  }

  abrirModalCBContratista(idContratista:number): void {
    const dialogRef = this.dialog.open(CuentabancariaContratistaComponent, {
      data: {
        idContratista: idContratista
    }
    });
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      // Verifica si se realizó la eliminación para actualizar los datos si es necesario
    });
  
  }

  ngOnInit(): void {
  }
}
