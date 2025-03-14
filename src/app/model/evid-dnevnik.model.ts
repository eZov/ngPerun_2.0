export class EvidDnevnik {
    constructor(
        public id?: number,        
        public employeeID?: number,
        public sifra_placanja?: string,
        public datum?: string,
        public week_day?: number,
        public vrijeme_od?: string,
        public vrijeme_do?: string,
        public vrijeme_ukupno?: string,        
        public opis_rada?: string,   
        public keyday?: boolean,   
        public evd_unio?: number,                    
        public locked?: boolean,       
        public evd_podnio?: number,
        public evd_odobrio?: number,
        public evd_kontrolisao?: number,   
        public locked_ext?: boolean,                             
    ) {}
}