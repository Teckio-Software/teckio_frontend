// only-numbers.directive.ts

import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormControl } from '@angular/forms'; // Para tipado

@Directive({
  selector: '[appOnlyNumbers]' // El selector que usarás en el HTML
})
export class OnlyNumbersDirective {

  constructor(private el: ElementRef, private controlDir: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const formControl = this.controlDir.control as FormControl;

    if (!formControl) {
      return;
    }

    // 1. Guarda la posición actual del cursor (UX)
    const start = this.el.nativeElement.selectionStart;
    const end = this.el.nativeElement.selectionEnd;
    
    // 2. Obtiene el valor actual y filtra caracteres no numéricos (\D)
    let valor = this.el.nativeElement.value;
    const valorFiltrado = valor.replace(/\D/g, '');

    // 3. Actualiza el FormControl (el modelo) con el valor filtrado.
    // Esto asegura que solo números se envíen.
    formControl.setValue(valorFiltrado, { emitEvent: false });
    
    // 4. Actualiza la vista del input.
    this.el.nativeElement.value = valorFiltrado;
    
    // 5. Restablece la posición del cursor, ajustándola si se eliminó un carácter
    if (start !== null) {
      const difference = valor.length - valorFiltrado.length;
      // Ajusta la posición del cursor si el valor ha cambiado de longitud
      this.el.nativeElement.setSelectionRange(start - difference, end - difference);
    }
  }
}