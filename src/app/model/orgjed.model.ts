export class OrgJed {

    constructor(
        public RowId: number = -1,          // Id reda u bazi podataka
        public Id?: number,             // Id org. jedinice (Sifra org. jedinice) koristi se za TreeView
        public ParentId?: number,       // Id nadređene org. jedinice (Sifra nadređene org. jedinice) koristi se za TreeView
        public Naziv: string = '',      // Naziv org. jedinice
        public HasChild?: boolean,
        public Expanded?: boolean,
        public Sfr: string = '',        // Sifra org. jedinice
        public SfrNadNivo: string = '', // Sifra nadređene org. jedinice
        public Obracun?: boolean,
        public Uposlenici?: boolean,
        public Atribut_1?: string,
        public Selected?: boolean      
    ) { }
}