import { useState } from "react";
import { environment } from "src/environments/environment.development";
import { taskXCoordinate } from "../../src/helpers/bar-helper";
import { Task } from "gantt-task-react";
import { Dependency } from "../../src";

// var obtenerLocalStorage = localStorage.getItem('idProyecto');
// var idProyecto = Number(obtenerLocalStorage);
// var obtenerLocalStorageEmpresa = localStorage.getItem('idEmpresa');
// var idEmpresa = Number(obtenerLocalStorageEmpresa);
// console.log(idProyecto, idEmpresa,"EwE");




export const GanttData = async (selectedEmpresa: number, selectedProyecto: number) =>{
    console.log("UwU entrando")
    try{
        const registros = await fetch(environment.apiURL + 'programacionestimadaGantt/' + selectedEmpresa + '/obtenerGanttXIdProyecto/' + selectedProyecto);
        const response = await registros.json();
        return response;
    }
    catch (error) {
        // throw new Error(error);
    }
}

export const ImporteSemanalGanttData = async (selectedEmpresa: number, selectedProyecto: number) =>{
    console.log("entrando a importe semanal")
    try{
        const registros = await fetch(environment.apiURL + 'programacionestimadaGantt/' + selectedEmpresa + '/obtenerImporteSemanalGantt/' + selectedProyecto);
        const response = await registros.json();
        console.log(response, "EwE2");
        return response;
    }
    catch (error) {
        // throw new Error(error);
    }
}

export interface programacionestimadaGanttDTO {
    id: string;
    name: string;
    idProyecto: number;
    idPrecioUnitario: number;
    cantidad: number;
    tipoPrecioUnitario: number;
    idConcepto: number;
    codigo: string;
    descripcion: string;
    costoUnitario: number;
    importe: number;
    start: Date;
    end: Date;
    duracion: number;
    progress: number;
    comando: number;
    desfaseComando: number;
    parent: string;
    type: string;
    numerador: number;
    predecesor: number;
    dependencies: any[];
    cadenaDependencias : string;
}

export interface dependenciaProgramacionEstimadaDTO{
    sourceId: string;
    sourceTarget: string;
    ownTarget: string;
    id: string;
    idProyecto: number;
    idProgramacionEstimadaGantt: number;
}

export const EditarGantt = async({ ...dataTask  } ,selectedEmpresa: number) =>{
    console.log(dataTask, "UwUdentro de la peticion");

    console.log(dataTask, "UwUdentro de la peticion" , selectedEmpresa);
    try{
        var programacionestimadaGantt: programacionestimadaGanttDTO = {
            id: dataTask["id"],
            name: dataTask["name"],
            idProyecto: dataTask["idProyecto"],
            idPrecioUnitario: dataTask["idPrecioUnitario"],
            cantidad: dataTask["cantidad"],
            tipoPrecioUnitario: dataTask["tipoPrecioUnitario"],
            idConcepto: dataTask["idConcepto"],
            codigo: dataTask["codigo"],
            descripcion: dataTask["descripcion"],
            costoUnitario: dataTask["costoUnitario"],
            importe: dataTask["importe"],
            start: dataTask["start"],
            end: dataTask["end"],
            duracion: dataTask["duracion"],
            progress: dataTask["progress"],
            comando: dataTask["comando"],
            desfaseComando: dataTask["desfaseComando"],
            parent: dataTask["parent"],
            type: dataTask["type"],
            dependencies: dataTask["dependencies"],
            numerador: dataTask["numerador"],
            predecesor: dataTask["predecesor"],
            cadenaDependencias: ""
        }
        var programacionestimadaGantt1 = JSON.stringify(programacionestimadaGantt);
        const registros = await fetch(
            environment.apiURL + 'programacionestimadaGantt/' + selectedEmpresa + '/EditarFechaGantt/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: programacionestimadaGantt1,
        });
        const response = await registros.json();
        return response;
    }
    catch (error) {
        // throw new Error(error);
    }
}

export const asignarProgresoGantt = async({ ...dataTask  } ,selectedEmpresa: number) =>{
    try{
        var programacionestimadaGantt: programacionestimadaGanttDTO = {
            id: dataTask["id"],
            name: dataTask["name"],
            idProyecto: dataTask["idProyecto"],
            idPrecioUnitario: dataTask["idPrecioUnitario"],
            cantidad: dataTask["cantidad"],
            tipoPrecioUnitario: dataTask["tipoPrecioUnitario"],
            idConcepto: dataTask["idConcepto"],
            codigo: dataTask["codigo"],
            descripcion: dataTask["descripcion"],
            costoUnitario: dataTask["costoUnitario"],
            importe: dataTask["importe"],
            start: dataTask["start"],
            end: dataTask["end"],
            duracion: dataTask["duracion"],
            progress: dataTask["progress"],
            comando: dataTask["comando"],
            desfaseComando: dataTask["desfaseComando"],
            parent: dataTask["parent"],
            type: dataTask["type"],
            dependencies: dataTask["dependencies"],
            numerador: dataTask["numerador"],
            predecesor: dataTask["predecesor"],
            cadenaDependencias: ""
        }
        var programacionestimadaGantt1 = JSON.stringify(programacionestimadaGantt);
        const registros = await fetch(
            environment.apiURL + 'programacionestimadaGantt/' + selectedEmpresa + '/asignarProgreso/',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: programacionestimadaGantt1,
        });
        const response = await registros.json();
        return response;
    }catch{

    }
    

}

export const asignarDuracionGantt = async({ ...dataTask  } ,selectedEmpresa: number) =>{
    try{
        var programacionestimadaGantt: programacionestimadaGanttDTO = {
            id: dataTask["id"],
            name: dataTask["name"],
            idProyecto: dataTask["idProyecto"],
            idPrecioUnitario: dataTask["idPrecioUnitario"],
            cantidad: dataTask["cantidad"],
            tipoPrecioUnitario: dataTask["tipoPrecioUnitario"],
            idConcepto: dataTask["idConcepto"],
            codigo: dataTask["codigo"],
            descripcion: dataTask["descripcion"],
            costoUnitario: dataTask["costoUnitario"],
            importe: dataTask["importe"],
            start: dataTask["start"],
            end: dataTask["end"],
            duracion: dataTask["duracion"],
            progress: dataTask["progress"],
            comando: dataTask["comando"],
            desfaseComando: dataTask["desfaseComando"],
            parent: dataTask["parent"],
            type: dataTask["type"],
            dependencies: dataTask["dependencies"],
            numerador: dataTask["numerador"],
            predecesor: dataTask["predecesor"],
            cadenaDependencias: ""
        }
        var programacionestimadaGantt1 = JSON.stringify(programacionestimadaGantt);
        const registros = await fetch(
            environment.apiURL + 'programacionestimadaGantt/' + selectedEmpresa + '/asignarDuracion/',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: programacionestimadaGantt1,
        });
        const response = await registros.json();
        return response;
    }catch{

    }
    

}

export const asignarComando = async({ ...dataTask  } ,selectedEmpresa: number) =>{
    try{
        var programacionestimadaGantt: programacionestimadaGanttDTO = {
            id: dataTask["id"],
            name: dataTask["name"],
            idProyecto: dataTask["idProyecto"],
            idPrecioUnitario: dataTask["idPrecioUnitario"],
            cantidad: dataTask["cantidad"],
            tipoPrecioUnitario: dataTask["tipoPrecioUnitario"],
            idConcepto: dataTask["idConcepto"],
            codigo: dataTask["codigo"],
            descripcion: dataTask["descripcion"],
            costoUnitario: dataTask["costoUnitario"],
            importe: dataTask["importe"],
            start: dataTask["start"],
            end: dataTask["end"],
            duracion: dataTask["duracion"],
            progress: dataTask["progress"],
            comando: dataTask["comando"],
            desfaseComando: dataTask["desfaseComando"],
            parent: dataTask["parent"],
            type: dataTask["type"],
            dependencies: dataTask["dependencies"],
            numerador: dataTask["numerador"],
            predecesor: dataTask["predecesor"],
            cadenaDependencias: ""
        }
        var programacionestimadaGantt1 = JSON.stringify(programacionestimadaGantt);
        const registros = await fetch(
            environment.apiURL + 'programacionestimadaGantt/' + selectedEmpresa + '/asignarComando/',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: programacionestimadaGantt1,
        });
        const response = await registros.json();
        return response;
    }catch{

    }
}

export const EliminarGantt = async(dependenciesPre: Dependency[], dependenciesPost: Dependency[] , selectedEmpresa: number) =>{
    console.log("EntraEliminar")
    try
    {
        console.log(dependenciesPre, "EwE");
        dependenciesPre.forEach(registro => {
            let registrosExistentes = dependenciesPost.filter((item) => item.sourceId == registro.sourceId);
            if(registrosExistentes.length <= 0){
                fetch(environment.apiURL + 'programacionestimadaGantt/' + selectedEmpresa + '/eliminarDependencia/' + registro.id,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                )
            }
        });
    }
    catch
    {

    }
}

export const GenerarDependencia = async(dependencies: dependenciaProgramacionEstimadaDTO, selectedEmpresa: number) =>{
    try
    {
        const registro = JSON.stringify(dependencies);
        fetch(environment.apiURL + 'programacionestimadaGantt/' + selectedEmpresa + '/generarDependencia/',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: registro,
            }
        )
    }
    catch{

    }
}

export const GenerarDependenciaXNumerador = async({ ...dataTask  } ,selectedEmpresa: number) =>{
    try{
        var programacionestimadaGantt: programacionestimadaGanttDTO = {
            id: dataTask["id"],
            name: dataTask["name"],
            idProyecto: dataTask["idProyecto"],
            idPrecioUnitario: dataTask["idPrecioUnitario"],
            cantidad: dataTask["cantidad"],
            tipoPrecioUnitario: dataTask["tipoPrecioUnitario"],
            idConcepto: dataTask["idConcepto"],
            codigo: dataTask["codigo"],
            descripcion: dataTask["descripcion"],
            costoUnitario: dataTask["costoUnitario"],
            importe: dataTask["importe"],
            start: dataTask["start"],
            end: dataTask["end"],
            duracion: dataTask["duracion"],
            progress: dataTask["progress"],
            comando: dataTask["comando"],
            desfaseComando: dataTask["desfaseComando"],
            parent: dataTask["parent"],
            type: dataTask["type"],
            dependencies: dataTask["dependencies"],
            numerador: dataTask["numerador"],
            predecesor: dataTask["predecesor"],
            cadenaDependencias: ""
        }
        console.log(programacionestimadaGantt, "Efe");
        var programacionestimadaGantt1 = JSON.stringify(programacionestimadaGantt);
        const registros = await fetch(
            environment.apiURL + 'programacionestimadaGantt/' + selectedEmpresa + '/generarDependenciaXNumerador/',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: programacionestimadaGantt1,
        });
        const response = await registros.json();
        return response;
    }catch{

    }
}

export const GenerarDesfase = async({ ...dataTask  } ,selectedEmpresa: number) =>{
    try{
        var programacionestimadaGantt: programacionestimadaGanttDTO = {
            id: dataTask["id"],
            name: dataTask["name"],
            idProyecto: dataTask["idProyecto"],
            idPrecioUnitario: dataTask["idPrecioUnitario"],
            cantidad: dataTask["cantidad"],
            tipoPrecioUnitario: dataTask["tipoPrecioUnitario"],
            idConcepto: dataTask["idConcepto"],
            codigo: dataTask["codigo"],
            descripcion: dataTask["descripcion"],
            costoUnitario: dataTask["costoUnitario"],
            importe: dataTask["importe"],
            start: dataTask["start"],
            end: dataTask["end"],
            duracion: dataTask["duracion"],
            progress: dataTask["progress"],
            comando: dataTask["comando"],
            desfaseComando: dataTask["desfaseComando"],
            parent: dataTask["parent"],
            type: dataTask["type"],
            dependencies: dataTask["dependencies"],
            numerador: dataTask["numerador"],
            predecesor: dataTask["predecesor"],
            cadenaDependencias: ""
        }
        console.log(programacionestimadaGantt, "Efe");
        var programacionestimadaGantt1 = JSON.stringify(programacionestimadaGantt);
        const registros = await fetch(
            environment.apiURL + 'programacionestimadaGantt/' + selectedEmpresa + '/asignarDesfase/',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: programacionestimadaGantt1,
        });
        const response = await registros.json();
        return response;
    }catch{

    }
}

// export const GenerarDependenciaXNumerador = async(gantt: programacionestimadaGanttDTO, selectedEmpresa: number) =>{
//     try
//     {
//         const registro = JSON.stringify({gantt});
//         fetch(environment.apiURL + 'programacionestimadaGantt/' + selectedEmpresa + '/generarDependenciaXNumerador/',
//             {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: registro,
//             }
//         )
//     }
//     catch{

//     }
// }

// export const getMunicipalities = async ({ identifier }) => {
//     try {
//       const resp = await fetch(
//         `https://microservice-kml-electoral-x7gq7zmvhq-uc.a.run.app/api/v1/cuadros/get-municipalities/${identifier}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const response = await resp.json();
   
//       return response.data;
//     } catch (error) {
//       throw new Error(error);
//     }
//   };