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

  imagen: Imagen={
    id: 0,
    ruta: '',
    base64: '',
    seleccionado: false,
    tipo: ''
  }

  selectedFile: File | null = null;

  imagenSrc: string = '';

/**
 * Constructor
 * @param {ImagenService} _imagenService
 * @param {SeguridadService} _seguridadService
 */
  constructor(private _imagenService: ImagenService,
    private _seguridadService: SeguridadService
  ) {
    let IdEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
   }

/**
 * Se encarga de obtener la imagen de la empresa seleccionada
 * al momento de inicializar el componente.
 */
  ngOnInit(): void {
    this.obtenerImagen();
   }

/**
 * Obtiene la imagen de la empresa seleccionada.
 * Esta función se encarga de obtener la imagen de la empresa seleccionada y actualiza
 * la propiedad imagenSrc con la ruta de la imagen en base64.
 */
  obtenerImagen(){
    this._imagenService.obtenerImagen(this.selectedEmpresa).subscribe((res) => {
      this.imagen = res;
      this.imagenSrc = 'data:image/'+this.imagen.tipo.replace('.','')+';base64,' + this.imagen.base64;
    });
  }



  /**
   * Cierra el modal de carga de imagen.
   */
  cerrarModal(){
    this.isOpenModal = false;
  }

/**
 * Detiene la propagación del evento de clic cuando se hace clic dentro del contenido del modal,
 * asegurando que el modal no se cierre inadvertidamente.
 * @param event El evento de clic.
 */
  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

/**
 * Selecciona un archivo de imagen y lo asigna a la propiedad selectedFile.
 * @param event El evento de selección de archivo.
 */
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0] as File;
    }
  }

/**
 * Sube una imagen a la API.
 * La función verifica si se ha seleccionado un archivo de imagen. Si no se ha seleccionado
 * ninguna imagen, muestra un mensaje de error en la consola y no hace nada más.
 * Si se ha seleccionado una imagen, crea un objeto FormData y agrega el archivo de imagen
 * seleccionado al objeto. Luego, realiza una solicitud HTTP POST a la API para subir la
 * imagen. La respuesta de la API se maneja en una suscripción, si la respuesta es exitosa,
 * se actualiza la propiedad imagenSrc con la ruta de la imagen en base64 y se cierra el
 * modal de carga de imagen.
 */
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
