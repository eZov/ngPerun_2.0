
export class Esignature {

    constructor(
        public pPutNalID?: number,
        public pEmployeeID?: number,
        public pPutNalESignature?: string,
        public ePublicKey?: string,
        public ePublicKeyId?: string
    ) {}
}
