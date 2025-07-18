import { Component, OnInit } from '@angular/core';
import { UsuarioGastosService } from '../usuario.service';
import { Router } from '@angular/router';
import { arbol_AutorizadoresDTO, autorizadoresDTO } from '../../datos-empleado/tsDatos-empleado';
import { DatosEmpleadoComponent } from '../../datos-empleado/datos-empleado/datos-empleado.component';

@Component({
  selector: 'app-nivel',
  templateUrl: './nivel.component.html',
  styleUrls: ['./nivel.component.css']
})
export class NivelComponent implements OnInit {
  niveles: autorizadoresDTO[][] = [];
  usuariosDisponibles: autorizadoresDTO[] = []; // Lista de usuarios disponibles para seleccionar
  guardarAutorizador: arbol_AutorizadoresDTO[] = []; // Lista de usuarios disponibles para seleccionar

  constructor(private usuarioService: UsuarioGastosService, private router: Router, private datosempleado: DatosEmpleadoComponent) { }

  ngOnInit(): void {
    this.niveles = this.usuarioService.getNiveles();
    this.usuarioService
    .obtenerPaginadoAutorizadores()
    .subscribe((autorizador) =>{
      this.usuariosDisponibles = autorizador;
    })
  }

  generarNivel(): void {
    this.niveles.push([]);
  }

  agregarUsuario(usuario: autorizadoresDTO, nivelIndex: number): void {
    this.niveles[nivelIndex].push(usuario); // Agregar usuario al nivel
    const index = this.usuariosDisponibles.indexOf(usuario);
    if (index !== -1) {
      this.usuariosDisponibles.splice(index, 1); // Eliminar usuario de la lista de disponibles
      this.guardarAutorizador[nivelIndex].idAutorizador = usuario.id;
      this.guardarAutorizador[nivelIndex].nivelAutorizacion = nivelIndex + 1;
    }
  }

  eliminarUsuario(usuario: autorizadoresDTO, nivelIndex: number): void {
    const index = this.niveles[nivelIndex].indexOf(usuario);
    if (index !== -1) {
      this.niveles[nivelIndex].splice(index, 1); // Eliminar usuario del nivel
      this.usuariosDisponibles.push(usuario); // Agregar usuario de vuelta a la lista de disponibles
      this.guardarAutorizador.splice(index, 1);
    }
  }

  eliminarNivel(nivelIndex: number): void {
    if (confirm("¿Estás seguro de que quieres eliminar este nivel?")) {
      // Obtener usuarios de este nivel antes de eliminarlo
      const usuariosEnNivel = this.niveles[nivelIndex];
      // Eliminar nivel
      this.niveles.splice(nivelIndex, 1);
      // Revertir los usuarios de este nivel a la lista de disponibles
      usuariosEnNivel.forEach(usuario => {
        this.usuariosDisponibles.push(usuario);
        this.guardarAutorizador.splice(nivelIndex, 1);
      });
    } 
  }

  guardarNivel(){
  }

  // guardarNivel(arbolAutorizadores: arbol_AutorizadoresDTO, idEmpresa: number){
    // arbolAutorizadores.idAutorizador;

    // this.guardarAutorizador
    // this.usuarioService.CrearRelación_ArbolxAutorizador(this.guardarAutorizador, idEmpresa)
  // }
}