import { DecimalPipe } from "@angular/common";

export class PutnalPrilog {
 
    constructor(
        public  id?: number,
        public  pn_id?: number,
        public  redbr?: number,
        public  opis?: string,
        public  iznos_val?: number,
        public  iznos?: number,
        public  kategorija?: number,
        public  pn_obracun_id?: number,
        public  obracun?: string,        
        public  odobren?:boolean,
        public  napomena?: string,
        public  timestamp?:Date) {}

}