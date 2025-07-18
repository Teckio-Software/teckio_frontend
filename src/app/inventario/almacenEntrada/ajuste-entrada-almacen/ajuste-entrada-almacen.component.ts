import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { almacenDTO } from '../../almacen/almacen';
import { AlmacenService } from '../../almacen/almacen.service';
import { insumoXOrdenCompraDTO } from 'src/app/compras/insumoxordencompra/tsInsumoXOrdenCompra';
import { AlmacenEntradaInsumoCreacionDTO} from '../../almacenEntradaInsumo/tsAlmacenEntradaInsumo';
import { InsumoDTO, InsumoParaExplosionDTO } from 'src/app/catalogos/insumo/tsInsumo';
import { PrecioUnitarioService } from 'src/app/proyectos/precio-unitario/precio-unitario.service';
import { TipoInsumoService } from 'src/app/catalogos/tipo-insumo/tipo-insumo.service';
import { tipoInsumoDTO } from 'src/app/catalogos/tipo-insumo/tsTipoInsumo';
import { InsumoService } from 'src/app/catalogos/insumo/insumo.service';
import { AlmacenEntradaCreacionDTO } from '../tsAlmacenEntrada';
import Swal from 'sweetalert2';
import { AlmacenEntradaService } from '../almacen-entrada.service';

@Component({
  selector: 'app-ajuste-entrada-almacen',
  templateUrl: './ajuste-entrada-almacen.component.html',
  styleUrls: ['./ajuste-entrada-almacen.component.css']
})
export class AjusteEntradaAlmacenComponent {
  formNuevaEntrada!: FormGroup;
  form!: FormGroup;
  idProyecto: number = 0;
  appRegarga: number = 1;
  almacenes!: almacenDTO[];
  insumos !: InsumoDTO[];
  explocionInsumos !: InsumoParaExplosionDTO[];
  explocionInsumosparaRequisicion !: InsumoParaExplosionDTO[];
  tipoInsumos !: tipoInsumoDTO[];
  selectedEmpresa : number = 0;
  insumosAjusteEntradaAlmacen !: AlmacenEntradaInsumoCreacionDTO[];
  almacenEntradaCreacion: AlmacenEntradaCreacionDTO = {
    idAlmacen: 0,
    idContratista: 0,
    listaInsumosEnAlmacenEntrada: [],
    observaciones: ''
  }
  @ViewChild('dialogNuevaEntradaAjustes', { static: true }) dialogNuevaEntradaAlmacenAjuste!: TemplateRef<any>;
  constructor(
    private FormBuilder: FormBuilder,
    private dialog: MatDialog,
    private _insumo: InsumoService, 
    private _explosionInsumos : PrecioUnitarioService,
    private _tipoInsumo : TipoInsumoService,
    private almacenService: AlmacenService,
    private _SeguridadEmpresa: SeguridadService,
    private _AlmacenEntradaService: AlmacenEntradaService
  ) { 
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
    this.idProyecto = Number(idProyecto);
  }

  ngOnInit() {
    this.insumosAjusteEntradaAlmacen = []
    this.insumosAjusteEntradaAlmacen.push({
      idInsumo: 0,
      descripcion: '',
      unidad: '',
      cantidadPorRecibir: 0,
      cantidadRecibida: 0,
      idOrdenCompra: 0,
      idInsumoXOrdenCompra: 0,
      idTipoInsumo: 0,
      idAlmacenEntrada: 0
    })
    this.dialog.open(this.dialogNuevaEntradaAlmacenAjuste, {
      width: '50%',
      disableClose: true
    });
    this.form = this.FormBuilder.group({
      almacen: ['', { validators: [], },]
      , observaciones: ['', { validators: [], },]
    });
    this._insumo.obtenerXIdProyecto(this.selectedEmpresa, this.idProyecto).subscribe((datos) => {
      this.insumos = datos;
    });
    this._explosionInsumos.explosionDeInsumos(this.idProyecto, this.selectedEmpresa).subscribe((datos) =>{
      this.explocionInsumos = datos;
      this.explocionInsumosparaRequisicion = this.explocionInsumos.filter(z => z.idTipoInsumo != 10000 && z.idTipoInsumo != 3 && z.idTipoInsumo != 10001);
    });
    this._tipoInsumo.TipoInsumosParaRequisitar(this.selectedEmpresa).subscribe((datos) => {
      this.tipoInsumos = datos;
    });
    this.almacenService.obtenerXIdProyecto(this.idProyecto, this.selectedEmpresa).subscribe((datos) => {
      this.almacenes = datos;
      this.appRegarga = this.appRegarga + 1;
    })
  }

  limpiarFormularioNuevaEntrada() {
    this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada = [];
    this.form.reset();
    this.dialog.closeAll();
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  informacionInsumo(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const idInsumo = this.insumos.find(insumo => insumo.descripcion == selectedValue)?.id || 0;

    let insumo = this.explocionInsumosparaRequisicion.filter(insumo => insumo.id == idInsumo);

    this.insumosAjusteEntradaAlmacen.forEach((element) => {
      if (element.descripcion == insumo[0].descripcion) {
        element.unidad = insumo[0].unidad;
        element.idInsumo = insumo[0].id;
        element.idTipoInsumo = insumo[0].idTipoInsumo;
        return;
      }
    });
  }

  guardarNuevaEntrada(){
    this.almacenEntradaCreacion.idAlmacen = this.form.get('almacen')?.value;
    this.almacenEntradaCreacion.observaciones = this.form.get('observaciones')?.value;
    this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada = this.insumosAjusteEntradaAlmacen;

    let valoresDuplicados = 0;
    this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada.forEach(element => {
      var duplicados = this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada.filter(z => z.descripcion == element.descripcion && z.unidad == element.unidad);
      if(duplicados.length > 1){
        valoresDuplicados ++ ;
      }
    });

    let validacion = this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada.filter(z => z.descripcion == "" || z.unidad == "" || z.idTipoInsumo == 0 || z.cantidadRecibida == null || z.cantidadRecibida <= 0);

    if (this.almacenEntradaCreacion.idAlmacen <= 0 || this.almacenEntradaCreacion.observaciones == "" || this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada.length <= 0  || validacion.length > 0 || valoresDuplicados > 0
    ) {
      Swal.fire({
        title: "Error",
        text: "Capture la información correctamente",
        icon: "error"
      });
    }else{
      this._AlmacenEntradaService.CrearAjusteEntradaAlmacen(this.selectedEmpresa, this.almacenEntradaCreacion).subscribe((datos) => {
        if (datos.estatus) {
          this.limpiarFormularioNuevaEntrada();
          this.dialog.closeAll();
        } else {
          Swal.fire({
            title: "Error",
            text: datos.descripcion,
            icon: "error"
          });
        }
      });
    } 

  }

  agregarNuevoInsumo(){
    let validacion = this.insumosAjusteEntradaAlmacen.filter(z => z.descripcion == "" || z.unidad == "" || z.idTipoInsumo == 0 || z.cantidadRecibida == null || z.cantidadRecibida <= 0);
    if(validacion.length <= 0){
      this.insumosAjusteEntradaAlmacen.push({
        idInsumo: 0,
        descripcion: '',
        unidad: '',
        idTipoInsumo: 0,
        cantidadPorRecibir: 0,
        cantidadRecibida: 0,
        idOrdenCompra: 0,
        idInsumoXOrdenCompra: 0,
        idAlmacenEntrada: 0
      });
    }else{
      return;
    }
  }

  EliminarListaInsumosXCotizacion(descripcion: string, unidad: string) {
    if (this.insumosAjusteEntradaAlmacen.length > 1) {
      var filtrarObjeto = this.insumosAjusteEntradaAlmacen.findIndex(z => z.descripcion == descripcion && z.unidad == unidad);
      if (filtrarObjeto > -1) {
        this.insumosAjusteEntradaAlmacen.splice(filtrarObjeto, 1);
      }
    }
  }
}
