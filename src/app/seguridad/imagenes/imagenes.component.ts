import { ChangeDetectionStrategy, Component, ElementRef, QueryList, ViewChildren, type OnInit } from '@angular/core';
import { ImagenService } from 'src/app/utilidades/imagen.service';
import { SeguridadService } from '../seguridad.service';
import { Imagen } from 'src/app/proyectos/precio-unitario/precio-unitario/imprimir-modal/ts.parametros-imprimir-pu';

@Component({
  selector: 'app-imagenes',
  templateUrl: './imagenes.component.html',
  styleUrls: [ './imagenes.component.css' ],
})
export class ImagenesComponent implements OnInit {

  selectedEmpresa: number = 0;

  isOpenModal: boolean = false;

  @ViewChildren('lista') listas!: QueryList<ElementRef<HTMLElement>>;

  // imagenes: Imagen[] = [];

  imagen: Imagen={
    id: 0,
    ruta: '',
    base64: '',
    seleccionado: false,
    tipo: ''
  }

  imagenSrc: string = '';

  constructor(private _imagenService: ImagenService,
    private _seguridadService: SeguridadService
  ) {
    let IdEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
   }

  ngOnInit(): void {
    this.obtenerImagen();
   }

  // cargarImagenes(){
  //   this._imagenService.obtenerImagenes(this.selectedEmpresa).subscribe({next: (imagenes) => {
  //     this.imagenes = imagenes;
  //   },
  //   error: (error) => {
  //     // console.log(error);
  //     //Mensaje de error
  //   }});
  // }

  obtenerImagen(){
    this._imagenService.obtenerImagen(this.selectedEmpresa).subscribe((res) => {
      this.imagen = res;
      this.imagenSrc = 'data:image/'+this.imagen.tipo.replace('.','')+';base64,' + this.imagen.base64;
    });
  }

  cerrarModal(){
    this.isOpenModal = false;
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0] as File;
    }
  }

   subirImagen() {
    if (!this.selectedFile) {
      console.error('No se ha seleccionado ninguna imagen.');
      return;
    }

    // Crear un objeto FormData
    const formData = new FormData();
    // El primer argumento ('file') DEBE coincidir con el nombre 
    // que esperas en el endpoint de .NET (ver más abajo).
    formData.append('file', this.selectedFile, this.selectedFile.name); 

    // Realizar la solicitud HTTP POST
    this._imagenService.cargarImagen(this.selectedEmpresa, formData).subscribe(
      (response) => {
        if(response.estatus){
          this.imagenSrc = response.descripcion;
          this.isOpenModal = false;
        }else{
          console.log(response.descripcion);
          
        }
      }
    );
  }

}
