import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { finalize } from 'rxjs';
import { GlosarioService } from '../services/glosario.service';
import { GlosarioDTO } from '../types/GlosarioDTO';

type ModalMode = 'create' | 'edit' | 'delete';

type TerminoFormulario = Pick<GlosarioDTO, 'termino' | 'definicion'>;

@Component({
  selector: 'app-modal-glosario',
  templateUrl: './modal-glosario.component.html',
  styleUrls: ['./modal-glosario.component.css'],
})
export class ModalGlosarioComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: ModalMode = 'create';
  @Input() termino: GlosarioDTO | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() completed = new EventEmitter<ModalMode>();

  modalTitle = '';
  isProcessing = false;
  glosarioTerminos: TerminoFormulario = {
    termino: '',
    definicion: '',
  };

  constructor(private _glosarioService: GlosarioService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['termino'] || changes['isOpen']) {
      this.configurarVista();
    }
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get isDeleteMode(): boolean {
    return this.mode === 'delete';
  }

  get primaryButtonLabel(): string {
    if (this.isDeleteMode) {
      return 'Eliminar';
    }

    return this.isEditMode ? 'Guardar cambios' : 'Crear término';
  }

  configurarVista(): void {
    if (!this.isOpen) {
      return;
    }

    if (this.isEditMode && this.termino) {
      this.modalTitle = 'Editar término';
      this.glosarioTerminos = {
        termino: this.termino.termino,
        definicion: this.termino.definicion,
      };
      return;
    }

    if (this.isDeleteMode && this.termino) {
      this.modalTitle = 'Eliminar término';
      this.glosarioTerminos = {
        termino: this.termino.termino,
        definicion: this.termino.definicion,
      };
      return;
    }

    this.modalTitle = 'Nuevo término';
    this.glosarioTerminos = {
      termino: '',
      definicion: '',
    };
  }

  cerrarModal(): void {
    this.isProcessing = false;
    this.close.emit();
  }

  ejecutarAccion(): void {
    if (this.isProcessing) {
      return;
    }

    if (this.isDeleteMode) {
      this.eliminarTermino();
      return;
    }

    if (this.isEditMode) {
      this.editarTermino();
      return;
    }

    this.crearTermino();
  }

  private crearTermino(): void {
    const nuevoTermino: GlosarioDTO = {
      id: 0,
      termino: this.glosarioTerminos.termino,
      definicion: this.glosarioTerminos.definicion,
      esBase: false,
    };

    this.isProcessing = true;
    this._glosarioService
      .crearTermino(nuevoTermino)
      .pipe(finalize(() => (this.isProcessing = false)))
      .subscribe({
        next: () => {
          this.completed.emit('create');
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al crear el termino', error);
        },
      });
  }

  private editarTermino(): void {
    if (!this.termino) {
      return;
    }

    const terminoEditado: GlosarioDTO = {
      ...this.termino,
      termino: this.glosarioTerminos.termino,
      definicion: this.glosarioTerminos.definicion,
    };

    this.isProcessing = true;
    this._glosarioService
      .editarTermino(terminoEditado)
      .pipe(finalize(() => (this.isProcessing = false)))
      .subscribe({
        next: () => {
          this.completed.emit('edit');
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al editar el termino', error);
        },
      });
  }

  private eliminarTermino(): void {
    if (!this.termino) {
      return;
    }

    this.isProcessing = true;
    this._glosarioService
      .eliminarTermino(this.termino.id)
      .pipe(finalize(() => (this.isProcessing = false)))
      .subscribe({
        next: () => {
          this.completed.emit('delete');
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al eliminar el termino', error);
        },
      });
  }
}
