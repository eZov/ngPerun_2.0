export class EvidDnStatus {
    constructor(
        public id?: number,        
        public employeeID?: number,
        public empFirstName?: string,
        public empLastName?: string,
        public YYYY?: number,
        public MM?: number,        
        public evd_podnio?: number,
        public evd_odobrio?: number,
        public evd_kontrolisao?: number,   
        public evd_stopped?: number,         
        public locked_ext?: boolean,                             
    ) {}
}