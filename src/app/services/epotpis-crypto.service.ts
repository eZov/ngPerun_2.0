import { Injectable } from '@angular/core';
import { Putnal } from "../model/putnal.model";

// import { Md5 } from 'ts-md5/dist/md5';
import { JSEncrypt } from 'jsencrypt';
import  CryptoJS from 'crypto-js';

import { privateKey, publicKey } from '../config';
import { Esignature } from '../model/esignature.model';
import { EsignatureByCert } from '../model/esignature-by-cert.model';

@Injectable({
  providedIn: 'root'
})
export class EpotpisCryptoService {
  $encrypt: any; // JSEncrypt 

  constructor() { 
    this.$encrypt = new JSEncrypt();  
  }

  calcHash(_spnalog: Putnal): string {

    let _string = (_spnalog.id ? _spnalog.id.toString() : '') 
    + (_spnalog.employee_id ? _spnalog.employee_id.toString() : '')
    + ( _spnalog.ime_prezime ?  _spnalog.ime_prezime : '')
    + (_spnalog.mjesto_putovanja ? _spnalog.mjesto_putovanja : '')
    + (_spnalog.dat_poc_putovanja ? _spnalog.dat_poc_putovanja : '')
    + (_spnalog.trajanje_putovanja ?_spnalog.trajanje_putovanja.toFixed(1) : '')
    + (_spnalog.iznos_akontacije ? _spnalog.iznos_akontacije.toFixed(6) : '');

    console.log("sppotpis-hash 1:", _string);
    return _string;
  }

  signHash(_hash: string): string {

    this.$encrypt.setPrivateKey(privateKey);
    var signature = this.$encrypt.sign(_hash, CryptoJS.SHA256, "sha256");
    console.log("sppotpis-hash 4:", signature);

    return signature;
  }

  verifyHash(_hash: string, _signature: string): boolean {

    // Verify with the public key...
    const verify = new JSEncrypt();
    verify.setPublicKey(publicKey);


    //const verified = verify.verify(_hash, _signature, CryptoJS.SHA256);

    return false;
  }

signPutNal(spnalog: Putnal){

  let _ehash = this.calcHash(spnalog);
  let _esign = this.signHash(_ehash);
  let verified = this.verifyHash(_ehash, _esign);

}

}
