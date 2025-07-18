import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class Unidades {
    public unidades !: string[];
    constructor(){
        this.unidades = ["	%	"	,
            "	(%)mdo	"	,
            "	350 kg	"	,
            "	bulto	"	,
            "	caj/100	"	,
            "	cb/19L	"	,
            "	cb/1L	"	,
            "	cb/20L	"	,
            "	cb/5L	"	,
            "	cto	"	,
            "	Cub	"	,
            "	cubeta/3	"	,
            "	Equipo	"	,
            "	Galón	"	,
            "	h	"	,
            "	ha	"	,
            "	Her	"	,
            "	hm	"	,
            "	Hoja	"	,
            "	Hora	"	,
            "	jgo	"	,
            "	jgo.	"	,
            "	Jor	"	,
            "	junta	"	,
            "	Kg	"	,
            "	kg.	"	,
            "	kw/h	"	,
            "	Litro	"	,
            "	Lote	"	,
            "	M	"	,
            "	M2	"	,
            "	M3	"	,
            "	m3/km	"	,
            "	m3-est	"	,
            "	m3-hm	"	,
            "	m3-km	"	,
            "	mes	"	,
            "	Millar	"	,
            "	ml	"	,
            "	pba	"	,
            "	piso	"	,
            "	plano	"	,
            "	pt	"	,
            "	Pza	"	,
            "	pza.	"	,
            "	r/d	"	,
            "	Rollo	"	,
            "	saco	"	,
            "	Salida	"	,
            "	Sistema	"	,
            "	Tamb/300	"	,
            "	tambo/20	"	,
            "	tmo	"	,
            "	tmo/3m	"	,
            "	tmo/6m	"	,
            "	toma	"	,
            "	Ton	"	,
            "	Ton/km	"	,
            "	uso	"];
    }

    public Getunidades (){
        return this.unidades
    }
}