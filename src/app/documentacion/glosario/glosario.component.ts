import { Component, OnInit } from '@angular/core';
import { GlosarioService } from '../services/glosario.service';
import { GlosarioDTO } from '../types/GlosarioDTO';
import { finalize } from 'rxjs';

type ModalMode = 'create' | 'edit' | 'delete';
type OrderMode = 'az' | 'recent';

@Component({
  selector: 'app-glosario',
  templateUrl: './glosario.component.html',
  styleUrls: ['./glosario.component.css'],
})
export class GlosarioComponent implements OnInit {
  terminos: GlosarioDTO[] = [];
  isLoading = false;
  isModalOpen = false;
  modalMode: ModalMode = 'create';
  selectedTermino: GlosarioDTO | null = null;
  searchTerm = '';
  orderMode: OrderMode = 'az';

  constructor(private _glosarioService: GlosarioService) {}

  get terminosFiltrados(): GlosarioDTO[] {
    const terminoBuscado = this.searchTerm.trim().toLowerCase();
    let terminosFiltrados = this.terminos;

    if (terminoBuscado) {
      terminosFiltrados = terminosFiltrados.filter((termino) => {
        const terminoTexto = termino.termino.toLowerCase();
        const definicionTexto = termino.definicion.toLowerCase();
        return (
          terminoTexto.includes(terminoBuscado) ||
          definicionTexto.includes(terminoBuscado)
        );
      });
    }

    const terminosOrdenados = [...terminosFiltrados];

    if (this.orderMode === 'az') {
      terminosOrdenados.sort((a, b) =>
        a.termino.localeCompare(b.termino, 'es', { sensitivity: 'base' })
      );
    } else {
      terminosOrdenados.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return terminosOrdenados;
  }

  ngOnInit(): void {
    this.cargarTerminos();
  }

  cargarTerminos(): void {
    this.isLoading = true;
    this._glosarioService
      .obtenerTodos()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (terminos) => {
          this.terminos = terminos;
        },
        error: (error) => {
          console.error('Error al obtener los terminos del glosario', error);
        },
      });
  }

  crearTermino(): void {
    this.abrirModal('create');
  }

  editarTermino(termino: GlosarioDTO): void {
    this.abrirModal('edit', termino);
  }

  eliminarTermino(termino: GlosarioDTO): void {
    this.abrirModal('delete', termino);
  }

  abrirModal(mode: ModalMode, termino?: GlosarioDTO): void {
    this.modalMode = mode;
    this.selectedTermino = termino ? { ...termino } : null;
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
  }

  manejarAccionExitosa(): void {
    this.cerrarModal();
    this.cargarTerminos();
  }

  setOrderMode(mode: OrderMode): void {
    this.orderMode = mode;
  }
}
