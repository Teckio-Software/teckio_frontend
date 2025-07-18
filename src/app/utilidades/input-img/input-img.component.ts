import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { toBase64 } from '../tsUtilidades';

@Component({
  selector: 'app-input-img',
  templateUrl: './input-img.component.html',
  styleUrls: ['./input-img.component.css']
})
export class InputImgComponent implements OnInit {
  @Output()
  zArchivoSeleccionado: EventEmitter<File> = new EventEmitter<File>();
  @Input()
  zUrlImagenActual: string = '';

  constructor() { }

  zvImagenBase64: string = '';

  ngOnInit(): void {
  }

  // zfChange(zEvent: any){
  //   if (zEvent.target.files.length > 0) {
  //     const zvFile: File = zEvent.target.files[0];
  //     toBase64(zvFile).then((zValue: string) => this.zvImagenBase64 = zValue)
  //     this.zArchivoSeleccionado.emit(zvFile);
  //     this.zUrlImagenActual = '';
  //   }
  // }
}
