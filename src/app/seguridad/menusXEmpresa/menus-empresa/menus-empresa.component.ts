import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MenuEstructuraDTO } from '../tsMenu';
import { SeguridadMultiEmpresaService } from '../../seguridad-multi-empresa/seguridad-multi-empresa.service';
import { MatTable } from '@angular/material/table';
import { corporativo } from '../../usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { CorporativoService } from 'src/app/catalogos/corporativo/corporativo.service';
import { EmpresaService } from 'src/app/catalogos/empresas/empresa.service';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';
import { MenusXEmpresaService } from '../../Servicios/menus-xempresa.service';

@Component({
  selector: 'app-menus-empresa',
  templateUrl: './menus-empresa.component.html',
  styleUrls: ['./menus-empresa.component.css']
})
export class MenusEmpresaComponent implements OnInit {
  @ViewChild('tablaMenu') tablaMenu?: MatTable<any>;
  treeControl = new NestedTreeControl<MenuEstructuraDTO>((node) => node.estructura);
  dataSource = new MatTreeNestedDataSource<MenuEstructuraDTO>();
  corporativos: corporativo[] = [];
  empresas: EmpresaDTO[] = [];
  descripcionMenu: string = "";
  dataMenu: MenuEstructuraDTO[] = [];
  dataSeccion: MenuEstructuraDTO[] = [];
  dataSeccionFiltrado: MenuEstructuraDTO[] = [];
  dataActividad: MenuEstructuraDTO[] = [];
  dataActividadFiltrado: MenuEstructuraDTO[] = [];
  selectedEmpresa: number = 0;
  selectedCorporativo: number = 0;
  constructor(
    private seguridadMultiEmpresaService: SeguridadMultiEmpresaService
    , private menusXEmpresaService: MenusXEmpresaService
    , private corporativoService: CorporativoService
    , private empresaService: EmpresaService) {}
  ngOnInit(): void {
    this.cargarRegistrosCorporativos();
    //this.cargarRegistros(this.selectedEmpresa);
    //this.cargarRegistrosEmpresas();
  }

  cargarRegistrosCorporativos(){
    this.corporativoService.lista()
    .subscribe((datos) => {
      this.corporativos = datos;
    })
  }
  cambiaCorporativo(registro: any){
    this.cargarRegistrosEmpresas(registro);
  }
  cargarRegistros(idEmpresa: number){
    this.dataMenu = [];
    this.dataSeccion = [];
    this.dataActividad = [];
    this.menusXEmpresaService.obtenMenuEstructura(idEmpresa)
    .subscribe((datos) => {
      this.dataMenu = datos;
      for (let index = 0; index < this.dataMenu.length; index++) {
        const element = this.dataMenu[index];
        for (let j = 0; j < element.estructura.length; j++) {
          const element2 = element.estructura[j];
          this.dataActividad.push(...element2.estructura);
        }
        this.dataSeccion.push(...element.estructura);
      }
    });
  }

  cargarRegistrosEmpresas(idCorporativo: number){
    this.empresaService.ObtenXIdCorporativo(idCorporativo)
    .subscribe((datos) => {
      this.empresas = datos;
      console.log(datos);
    });
  }

  cargarRegistrosSecciones(menu: MenuEstructuraDTO){

    this.descripcionMenu = menu.descripcion;
    this.dataSeccionFiltrado = [];
    for (let index = 0; index < this.dataSeccion.length; index++) {
      const element = this.dataSeccion[index];
      if (element.idMenu === menu.idMenu) {
        this.dataSeccionFiltrado.push(element);
      }
    }
    this.dataActividadFiltrado = [];
  }

  cargarRegistrosActividades(idSeccion: number){
    this.dataActividadFiltrado = [];
    for (let index = 0; index < this.dataActividad.length; index++) {
      const element = this.dataActividad[index];
      if (element.idSeccion === idSeccion) {
        this.dataActividadFiltrado.push(element);
      }
    }
  }

  cambiaEmpresa(idEmpresa: number){
    this.selectedEmpresa = idEmpresa;
    this.dataMenu = [];
    this.dataSeccionFiltrado = [];
    this.dataActividadFiltrado = [];
    this.cargarRegistros(this.selectedEmpresa);
  }

  autorizaMenu(objeto: MenuEstructuraDTO){
    if (this.selectedEmpresa <= 0) {
      return;
    }
    if (objeto.esAutorizado == true) {
      this.menusXEmpresaService.autorizaMenu({
        idEmpresa: this.selectedEmpresa,
        idMenu: objeto.idMenu
      })
      .subscribe();
    }
    if (objeto.esAutorizado == false) {
      this.menusXEmpresaService.desautorizaMenu({
        idEmpresa: this.selectedEmpresa,
        idMenu: objeto.idMenu
      })
      .subscribe();
    }
    console.log(objeto);
  }
}
