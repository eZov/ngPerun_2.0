export class EvidMultiNotification {
    constructor(
        public Id?: number,      //API: API klasa NgSfrEvidPris ima string type na ovom polju  
        public SenderId?: number,
        public ReceiverId?: number[],        
        public Content?: string
    ) {}
}