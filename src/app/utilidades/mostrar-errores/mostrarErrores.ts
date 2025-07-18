export function zfParsearErroresAPI(zResponse: any): string[]{
  const zvListaResultados: string[] = [];
  if (zResponse.error) {
      if (typeof zResponse.error === 'string') {
          zvListaResultados.push(zResponse.error);
      }
      else if (Array.isArray(zResponse.error)) {
          zResponse.error.forEach((zValor:any) => zvListaResultados.push(zValor.description));
      }
      else{
          //A veces lo que tenemos es un mapa de errores y campos
          const zvMapaErrores = zResponse.error.errors;
          //Transformamos nuestro objeto en un arreglo
          const zvEntradas = Object.entries(zvMapaErrores);
          zvEntradas.forEach((zArreglo: any[]) => {
              const zvCampo = zArreglo[0];
              zArreglo[1].forEach((zMensajeError:any) => {
                  //String interpolation
                  zvListaResultados.push(`${zvCampo}: ${zMensajeError}`);
              });
          });
      }
  }
  return zvListaResultados;
}
