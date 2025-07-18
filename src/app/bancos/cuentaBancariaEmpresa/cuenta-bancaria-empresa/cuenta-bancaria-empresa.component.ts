import { Component, ElementRef, ViewChild } from '@angular/core';
import { CuentaBancariaDTO } from '../tsCuentaBancariaEmpresa';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BancoDTO } from '../../banco/tsBanco';
import { CuentaBancariaEmpresaService } from '../cuenta-bancaria-empresa.service';
import Swal from 'sweetalert2';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';

@Component({
  selector: 'app-cuenta-bancaria-empresa',
  templateUrl: './cuenta-bancaria-empresa.component.html',
  styleUrls: ['./cuenta-bancaria-empresa.component.css']
})
export class CuentaBancariaEmpresaComponent {
  cuentasBancarias: CuentaBancariaDTO[] = [];
  cuentaBancariaReset: CuentaBancariaDTO[] = [];
  selectedCuentaBancaria: number = 0;
  form!:FormGroup;
  cuentaBancaria: CuentaBancariaDTO = {
    id: 0,
    numerocuenta : "",
    cuentaclabe : "",
    nombrebanco : ""
  };
  selectedEmpresa : number = 0;
  @ViewChild('staticBackdrop')
  staticBackdrop!: ElementRef;

  constructor(private CuentaBancariaService:CuentaBancariaEmpresaService,
    private FormBuilder: FormBuilder,
    private _SeguridadEmpresa: SeguridadService
  ){
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
        this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    this.form = this.FormBuilder.group({
      numerocuenta:['', {validators: [],},]
      ,cuentaclabe:['', {validators: [],},]

    });
    this.cargarRegistros();
  }

  cargarRegistros(){
    this.CuentaBancariaService.ObtenerCuentasBancarias(this.selectedEmpresa).subscribe((datos)=>{
      this.cuentasBancarias = datos;
      this.cuentaBancariaReset = datos;
    })
  }

  crearCuentaBancaria(){
    this.cuentaBancaria.numerocuenta =  this.form.get("numerocuenta")?.value;
    this.cuentaBancaria.cuentaclabe =  this.form.get("cuentaclabe")?.value;

    if(this.cuentaBancaria.numerocuenta == "" || typeof this.cuentaBancaria.numerocuenta == 'undefined' ||
    this.cuentaBancaria.cuentaclabe == "" || typeof this.cuentaBancaria.cuentaclabe == 'undefined'
    ){
      Swal.fire({
        title: "Error",
        text: "Capture todos los datos.",
        icon: "error"
      });
    }else{
      if(this.selectedCuentaBancaria <= 0){
        this.CuentaBancariaService.GuardarCuentaBancaria(this.cuentaBancaria, this.selectedEmpresa).subscribe((datos)=>{
          if (datos.estatus) {
            Swal.fire({
              title: "Correcto",
              text: datos.descripcion,
              icon: "success"
            });
          }
          else{
            Swal.fire({
              title: "Error",
              text: datos.descripcion,
              icon: "error"
            });
          }
          this.cargarRegistros();
        })
      }else{
        this.cuentaBancaria.id = this.selectedCuentaBancaria;
        this.CuentaBancariaService.EditarCuentaBancaria(this.cuentaBancaria, this.selectedEmpresa).subscribe((datos)=>{
          if (datos.estatus) {
            Swal.fire({
              title: "Correcto",
              text: datos.descripcion,
              icon: "success"
            });
          }
          else{
            Swal.fire({
              title: "Error",
              text: datos.descripcion,
              icon: "error"
            });
          }
          this.cargarRegistros();
        })
      }
      this.selectedCuentaBancaria = 0;
      this.cuentaBancaria.id = 0;
      this.cuentaBancaria.numerocuenta = "";
      this.cuentaBancaria.cuentaclabe = "";
    }


  }

  obtenerinfoCuentaBancaria(cuentaBancaria:CuentaBancariaDTO){
    this.form.get("numerocuenta")?.setValue(cuentaBancaria.numerocuenta);
    this.form.get("cuentaclabe")?.setValue(cuentaBancaria.cuentaclabe);

    this.selectedCuentaBancaria = cuentaBancaria.id;
  }

  eliminarCuentaBancaria(id:number){
    this.CuentaBancariaService.EliminarCuentaBancaria(id, this.selectedEmpresa).subscribe((datos) =>{
      if (datos.estatus) {
        Swal.fire({
          title: "Correcto",
          text: datos.descripcion,
          icon: "success"
        });
      }
      else{
        Swal.fire({
          title: "Error",
          text: datos.descripcion,
          icon: "error"
        });
      }
      this.cargarRegistros();
    })
  }



}
