export class EsignatureByCert {

    constructor(
        public pnID?: number,
        public pnDoc?: number,    
        public signPos?: number,            
        public employeeID?: number,
        public password?: string,
        public statusfrom?: string,
        public statusto?: string,

    ) { }
}