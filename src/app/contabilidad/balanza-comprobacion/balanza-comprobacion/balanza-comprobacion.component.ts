import { Component, OnInit, TemplateRef, ViewChild, Injectable } from '@angular/core';
import { BalanzaComprobacionService } from '../balanza-comprobacion.service';
import { vistaBalanzaComprobacionDTO, filtroBalanzaPeriodoDTO, filtroBalanzaRangoFechaDTO } from '../tsBalanzaComprobacion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FechasService } from 'src/app/utilidades/fechas/fechas.service';
import { aniosDTO, mesesDTO } from 'src/app/utilidades/fechas/fechas';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
@Component({
    selector: 'app-balanza-comprobacion',
    templateUrl: './balanza-comprobacion.component.html',
    styleUrls: ['./balanza-comprobacion.component.css']
})
export class BalanazaComprobacionComponent implements OnInit {
    selectedEmpresa: number = 0;
    balanzas!: vistaBalanzaComprobacionDTO[];
    filtroPeriodo: filtroBalanzaPeriodoDTO = {
        mes: new Date().getMonth() + 1,
        anio: new Date().getFullYear()
    }
    filtroRangoFecha: filtroBalanzaRangoFechaDTO = {
        mesInicio: new Date().getMonth() + 1,
        anioInicio: new Date().getFullYear(),
        mesTermino: new Date().getMonth() + 1,
        anioTermino: new Date().getFullYear()
    }
    debe = 0;
    haber = 0;
    saldoInicial = 0;
    saldoFinal = 0;
    anios: aniosDTO[] = [];
    meses: mesesDTO[] = [];
    mesFiltroPeriodo = 0;
    anioFiltroPeriodo = 0;

    constructor(private balanzaComprobacionService: BalanzaComprobacionService
        , private _snackBar: MatSnackBar
        , private formBuilder: FormBuilder
        , private dialog: MatDialog
        , private fechasService: FechasService
        , private _seguridadService: SeguridadService) { 
            let idEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
            this.selectedEmpresa = Number(idEmpresa);
        }

    ngOnInit(): void {
        this.cargarRegistros();
        this.meses = this.fechasService.obtenerMeses();
        this.anios = this.fechasService.obtenerAnios();
    }

    cargarRegistros() {
        this.balanzaComprobacionService.obtenXPeriodo(this.filtroPeriodo, this.selectedEmpresa)
            .subscribe((balanza) => {
                this.balanzas = balanza;
                this.balanzas.forEach(balanza => {
                    this.debe = this.debe + balanza.debe;
                    this.haber = this.haber + balanza.debe;
                });
            })
    }

    expansionDominio(balanza: vistaBalanzaComprobacionDTO): void {
        balanza.expandido = !balanza.expandido;
    }

    cargarPorPeriodo() {
        this.balanzaComprobacionService.obtenXPeriodo(this.filtroPeriodo, this.selectedEmpresa)
            .subscribe((balanzas) => {
                this.balanzas = balanzas;
                this.balanzas.forEach(balanza => {
                    this.debe = this.debe + balanza.debe;
                    this.haber = this.haber + balanza.debe;
                });
            });
    }

    cargarPorRangoFecha() {
        if (this.filtroRangoFecha.anioTermino < this.filtroRangoFecha.anioInicio) {
            this.filtroRangoFecha.anioTermino = this.filtroRangoFecha.anioInicio;
        }
        if ((Number(this.filtroRangoFecha.anioTermino) == Number(this.filtroRangoFecha.anioInicio)) && Number(this.filtroRangoFecha.mesInicio) > Number(this.filtroRangoFecha.mesTermino)) {
            this.filtroRangoFecha.mesTermino = this.filtroRangoFecha.mesInicio;
        }
        this.balanzaComprobacionService.obtenXRangoFecha(this.filtroRangoFecha, this.selectedEmpresa)
            .subscribe((balanzas) => {
                this.balanzas = balanzas;
                this.balanzas.forEach(balanza => {
                    this.debe = this.debe + balanza.debe;
                    this.haber = this.haber + balanza.debe;
                });
            })
    }

    filaSeleccionada: any; // Variable para almacenar la fila seleccionada

    // Método para manejar el clic en la fila y actualizar la fila seleccionada
    seleccionarFila(balanza: any) {
        this.filaSeleccionada = balanza;
    }
}
