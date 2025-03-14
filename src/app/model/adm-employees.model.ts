export class AdmEmployee {

    constructor(
        public Email?: string,        
        public EmailDef?: string,         
        public EmployeeID?: number,
        public FirstName?: number,
        public LastName?: string,
        public OrgJedNaziv?: string,
        public OrgJedNaziv2?: string,        
        public OrgJedSifra?: string,          
        public WebUser?: boolean,
        public WebAccess?: boolean, 
        public MobUser?: boolean,        
        public Epotpis?: boolean,
        public Epotpisnik?: boolean               
    ) { }
}