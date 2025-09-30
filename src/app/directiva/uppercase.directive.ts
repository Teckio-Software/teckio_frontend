// uppercase-input.directive.ts

import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms'; // Mantiene la inyección
import { FormControl } from '@angular/forms'; // Importa FormControl para tipado

@Directive({
  selector: '[appUppercaseInput]' // El selector que usarás en el HTML
})
export class UppercaseInputDirective {

  constructor(private el: ElementRef, private controlDir: NgControl) {
    // controlDir es el NgControl inyectado
  }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    // Obtenemos el FormControl real del controlDir inyectado
    const formControl = this.controlDir.control as FormControl;

    // Si no hay FormControl, se sale.
    if (!formControl) {
      return;
    }

    // Mantiene el cursor en su posicion
    const start = this.el.nativeElement.selectionStart;
    const end = this.el.nativeElement.selectionEnd;
    
    // Obtiene el valor actual y lo convierte en mayúsculas
    const valorMayusculas = this.el.nativeElement.value.toUpperCase();

    // 5. Actualizamos el FormControl (el modelo) con el nuevo valor en mayúsculas.
    formControl.setValue(valorMayusculas, { emitEvent: false });
    
    // Se actualiza el valor en la vista del input (opcional, setValue ya lo hace, pero garantiza).
    this.el.nativeElement.value = valorMayusculas; 
    
    // Se reestablece la posición del cursor (mejora la UX).
    this.el.nativeElement.setSelectionRange(start, end);
  }
}