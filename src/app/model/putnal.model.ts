import { DecimalPipe } from "@angular/common";

export class Putnal {

    constructor(
        public id?: number,
        public employee_id?: number,
        public ime_prezime?: string,
        public radno_mjesto?: string,
        public uposlenik?:number,        
        public razlog_putovanja?: string,
        public mjesto_start?: string,
        public mjesto_putovanja?: string,
        public dat_poc_putovanja?: string,
        public trajanje_putovanja?: number,
        public relacija?: string,
        public prev_text?: string,
        public PrevAuto?: boolean,
        public PrevVlAuto?: boolean,
        public PrevAvion?: boolean,
        public PrevAutobus?: boolean,
        public PrevVoz?: boolean,
        public troskovi_putovanja_knjizenje?: string,
        public aktivnost?: string,
        public org_jed?: string, //HACK: ovo je broj protokola koji upisuje sekretarica
        public UkTroskoviA?: number,
        public UkTroskoviB?: number,
        public UkTroskoviC?: number,
        public UkTroskoviD?: number,
        public UkIznosObracuna?: number,
        public UkIznosRazlika?: number,
        public iznos_dnevnice?: number,
        public proc_dnevnice?: number,
        public broj_dnevnica?: number,
        public akontacija_dnevnice?: number,
        public akontacija_nocenje?: number,
        public akontacija_ostalo?: number,
        public iznos_akontacije?: number,
        public ispl_akontacije?: number,        
        public odobrena_akontacija?: boolean,
        public vrsta_naloga?: number,
        public status_naloga?: string,
        public status_date?: string,
        public created_by?: string,
        public potpis_naloga?: string,
        public isSignee?: number,
        public nazivorgjed?: string,
        public izvjestaj?: string,
        public temeljnica_1?: string,  //HACK: temelnjica koji upisuje blagajna      
        public temeljnica_2?: string,         
        public pn_protokol?: string, //HACK: ovo je broj protokola koji upisuje sekretarica        
        public Done?: boolean) { }
}