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
        public ostali_troskovi?: number,
        public obr_ostalih_troskova?: string, 
        public order_id?: number,                               
        public Done?:boolean) {}
}