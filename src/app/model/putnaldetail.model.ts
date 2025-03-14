import { DecimalPipe } from "@angular/common";

export class PutnalDetail {
 
    constructor(
        public id?: number,
        public pn_id?: number,
        public pn_oblast?: number,        
        public relacija?: string,
        public dat_polaska?: string,
        public dat_povratka?: string,                             
        public broj_sati?: number,
        public broj_dnevnica?: number,
        public iznos_dnevnice?: number,
        public ukupan_iznos?: number,
        public vrsta_prevoza?: string,       
        public razred?: string,
        public iznos_karte?: number,
        public naknada_km?: number,
        public troskovi_goriva?: number,
        public troskovi_parkinga?: number,
        public ostali_troskovi?: number,
        public obr_ostalih_troskova?: string, 
        public order_id?: number,                               
        public Done?:boolean) {}
}

// mapiranje kolona za novu verziju troškova prevoza:
//  1. relacija:        relacija        string
//  2. vrsta prevoza:   vrsta_prevoza   string
//  3. vrsta troška:    razred          string  
//  4. količina:        iznos_karte     number
//  5. ukupno:          ukupan_iznos    number      