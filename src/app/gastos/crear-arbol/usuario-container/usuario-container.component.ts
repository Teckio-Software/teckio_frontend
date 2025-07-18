import { Component, OnInit } from '@angular/core';
import { UsuarioGastosService } from '../usuario.service';
import { Router } from '@angular/router';
import { autorizadoresDTO } from '../../datos-empleado/tsDatos-empleado';


@Component({
  selector: 'app-usuario-container',
  templateUrl: './usuario-container.component.html',
  styleUrls: ['./usuario-container.component.css']
})
export class UsuarioContainerComponent implements OnInit {
  usuariosDisponibles: autorizadoresDTO[] = [];

  constructor(private usuarioService: UsuarioGastosService, private router: Router) { }

  ngOnInit(): void {
    this.usuarioService
    .obtenerPaginadoAutorizadores()
    .subscribe((autorizador) =>{
      this.usuariosDisponibles = autorizador;
    })
  }

  eliminarUsuario(usuario: autorizadoresDTO): void {
    this.usuarioService.eliminarUsuario(usuario);
    this.usuarioService
    .obtenerPaginadoAutorizadores()
    .subscribe((autorizador) =>{
      this.usuariosDisponibles = autorizador;
    });
  }

}
