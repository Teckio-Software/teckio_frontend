import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './services/dashboard.service';
import { RequisicionDTO } from './types/RequisicionDTO';
import { finalize, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { main } from '@popperjs/core';
import { fi } from 'date-fns/locale';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  numeroDeProyectos: number = 0;
  numeroAnimado: number = 0;
  proyectosTerminados: number = 0;
  requisiciones: RequisicionDTO[] = [];
  isLoading: boolean = false;
  data: any;
  options: any;

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.data = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [
        {
          label: 'Facturación 2024',
          data: [120, 200, 150, 80, 250, 300],
          fill: false,
          borderColor: '#3b82f6',
          tension: 0.4,
        },
        {
          label: 'Facturación 2025',
          data: [100, 150, 120, 60, 180, 240],
          fill: false,
          borderColor: '#22c55e',
          tension: 0.4,
        },
      ],
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };

    this.isLoading = true;
    const MS_VISIBLE = 800;
    const inicio = Date.now();

    forkJoin({
      proyectos: this.dashboardService.obtenerProyectos(),
      requisiciones: this.dashboardService.obtenerRequisiciones(),
    })
      .pipe(
        finalize(() => {
          const tiempoTranscurrido = Date.now() - inicio;
          const tiempoRestante = Math.max(0, MS_VISIBLE - tiempoTranscurrido);
          setTimeout(() => {
            this.isLoading = false;
          }, tiempoRestante);
        })
      )
      .subscribe({
        next: ({ proyectos, requisiciones }) => {
          this.numeroDeProyectos = proyectos.length;
          this.requisiciones = requisiciones
            .sort(
              (a, b) =>
                new Date(b.fechaRegistro).getTime() -
                new Date(a.fechaRegistro).getTime()
            )
            .slice(0, 5);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al obtener datos del dashboard', error);
        },
      });
  }

  navigateToProjects(): void {
    this.router.navigate(['/proyecto']);
  }

  navigateToRequisiciones(): void {
    this.router.navigate(['/requisicion']);
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
