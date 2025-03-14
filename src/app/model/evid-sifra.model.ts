export class EvidSifra {
    constructor(
        public itemType?: number,      //API: API klasa NgSfrEvidPris ima string type na ovom polju  
        public sifra?: string,
        public title?: string,        
        public color?: string,
        public sati?: number
    ) {}
}