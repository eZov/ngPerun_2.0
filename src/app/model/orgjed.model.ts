export class OrgJed {

    constructor(
        public Id?: number,
        public ParentId?: number,
        public Naziv?: string,
        public HasChild?: boolean,
        public Expanded?: boolean,
        public Sfr?: string,        
        public SfrNadNivo?: string,
        public Obracun?: boolean,
        public Uposlenici?: boolean,
        public Atribut_1?: string,
        public Selected?: boolean      
    ) { }
}