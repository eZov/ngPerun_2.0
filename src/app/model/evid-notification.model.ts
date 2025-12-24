export class EvidNotification {
    constructor(
        public Id?: number,      //API: API klasa NgSfrEvidPris ima string type na ovom polju  
        public SenderId?: number,
        public ReceiverId?: number,        
        public ReceiverName?: string,          
        public Content?: string,
        public ContentId?: number,
        public IsRead?: boolean
    ) {}
}