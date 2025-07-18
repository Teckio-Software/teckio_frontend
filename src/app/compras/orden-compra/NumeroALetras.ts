export function numeroALetras(num: number): string {
  const UNIDADES = [
    '',
    'UNO',
    'DOS',
    'TRES',
    'CUATRO',
    'CINCO',
    'SEIS',
    'SIETE',
    'OCHO',
    'NUEVE',
  ];
  const DECENAS = [
    '',
    'DIEZ',
    'VEINTE',
    'TREINTA',
    'CUARENTA',
    'CINCUENTA',
    'SESENTA',
    'SETENTA',
    'OCHENTA',
    'NOVENTA',
  ];
  const CENTENAS = [
    '',
    'CIENTO',
    'DOSCIENTOS',
    'TRESCIENTOS',
    'CUATROCIENTOS',
    'QUINIENTOS',
    'SEISCIENTOS',
    'SETECIENTOS',
    'OCHOCIENTOS',
    'NOVECIENTOS',
  ];
  const ESPECIALES = {
    10: 'DIEZ',
    11: 'ONCE',
    12: 'DOCE',
    13: 'TRECE',
    14: 'CATORCE',
    15: 'QUINCE',
    16: 'DIECISEIS',
    17: 'DIECISIETE',
    18: 'DIECIOCHO',
    19: 'DIECINUEVE',
    21: 'VEINTIUNO',
    22: 'VEINTIDOS',
    23: 'VEINTITRES',
    24: 'VEINTICUATRO',
    25: 'VEINTICINCO',
    26: 'VEINTISEIS',
    27: 'VEINTISIETE',
    28: 'VEINTIOCHO',
    29: 'VEINTINUEVE',
  };

  function seccion(n: number): string {
    if (n === 0) return '';
    if (n < 10) return UNIDADES[n];
    if (ESPECIALES.hasOwnProperty(n))
      return ESPECIALES[n as keyof typeof ESPECIALES];
    if (n < 100) {
      const d = Math.floor(n / 10);
      const u = n % 10;
      return DECENAS[d] + (u > 0 ? ' Y ' + UNIDADES[u] : '');
    }
    if (n === 100) return 'CIEN';
    const c = Math.floor(n / 100);
    return CENTENAS[c] + ' ' + seccion(n % 100);
  }

  function miles(n: number): string {
    if (n < 1000) return seccion(n);
    const m = Math.floor(n / 1000);
    const r = n % 1000;
    if (m === 1) return 'MIL ' + seccion(r);
    return seccion(m) + ' MIL ' + seccion(r);
  }

  function millones(n: number): string {
    if (n < 1000000) return miles(n);
    const mill = Math.floor(n / 1000000);
    const r = n % 1000000;
    if (mill === 1) return 'UN MILLON ' + miles(r);
    return seccion(mill) + ' MILLONES ' + miles(r);
  }

  const [enteroStr, decimalStr] = num.toFixed(2).split('.');
  const entero = parseInt(enteroStr, 10);
  const decimal = parseInt(decimalStr, 10);

  const letrasEntero = millones(entero).trim() || 'CERO';
  const letrasCentavos = decimal > 0 ? ` CON ${seccion(decimal)} CENTAVOS` : '';

  return `${letrasEntero} PESOS ${decimal}/100 MN`;
}
