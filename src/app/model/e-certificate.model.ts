export class ECertificate {
    constructor(
        public id?: number,        
        public employeeID?: number,
        public subjectCN?: string,
        public issuerCN?: string,
        public validFrom?: Date,                    
        public validTo?: Date,
        public validYears?: number,  
        public password?: string,   
        public X509Name_C?: string,  
        public X509Name_O?: string,  
        public X509Name_L?: string,  
        public X509Name_ST?: string,  
        public X509Name_E?: string,  
        public signPos?: number,   
        public ecertStatus?: string,               
        public ecertOdobrenje?: string,          
        public ImgExist?: boolean,            
        public PfxExist?: boolean        
    ) {}
}