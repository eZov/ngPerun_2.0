import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject } from "rxjs";

import { UserSessionService } from '../core-module/services/user-session.service';
import { RestDataSource } from '../shared/rest.datasource';

import { ECertificate } from '../model/e-certificate.model';
import { LoaderService } from '../core-module/services/loader.service';
import { isUndefined } from 'util';


@Injectable({
  providedIn: 'root'
})
export class EpotpisService {

  public path!: Object;

  private _isActiveImgUpload = new Subject<boolean>();
  private _isActivePfxPassword = new Subject<boolean>();
  private _statusMessage = new Subject<string>();
  private _statusOdobrenje = new Subject<string>();
  private _statusMessageDate = new Subject<string>();

  private _isImageLoading = new Subject<boolean>();
  public imageToShow: any;

  private _imgServExist = new Subject<boolean>();

  constructor(
    public restDataSource: RestDataSource,
    public usersession: UserSessionService,
    private loaderService: LoaderService,
    private sanitizer: DomSanitizer) {

    this._isActiveImgUpload.next(false);
    this._isImageLoading.next(true);

  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {

    let _ECertificate: ECertificate = {
      employeeID: this.usersession.empId
    };

    return this.restDataSource.getEcertStatus(_ECertificate);

  }

  setPath() {
    // API ec-C1 
    //
    this.path = {
      saveUrl: this.restDataSource.baseUrl + 'ecertimgins?pEmployeeID=' + this.usersession.empId.toString()
    };

  }

  delImg() {
    // API ec-D1 
    //
    console.log('Delete image in service...' + this.usersession.empId);

    this.restDataSource.delEcertImg(this.usersession.empId)
      .subscribe((result) => {
        console.log('Delete image in service finished...' + result);
        this.getStatus();
        this.loaderService.display(false);
      },
        err => {
          console.log(err);
          this.loaderService.display(false);
        });
  }

  getStatus() {

    let _ECertificate: ECertificate = {
      employeeID: this.usersession.empId
    };
    this.restDataSource.getEcertStatus(_ECertificate)
      .subscribe((result: ECertificate) => {
        console.log('getStatus in service finished...' + result);
        // Formiraj date iz ISO 8601 stringa: 2020-07-03T08:58:12
        if (result.validFrom) {
          result.validFrom = new Date(result.validFrom);
        }

        // Simulira API poziv ...
        result.ecertOdobrenje = "..."

        this._imgServExist.next(result.ImgExist ?? false);
        
        this.getStatus2(result);

        if (result.ImgExist == true) {
          this.getImg();
        }


      },
        err => {
          console.log(err);
        });
  }

  getStatus2(_ECertificate: ECertificate) {


    switch (_ECertificate.ecertStatus) {
      case "no_signature":
        this._isActiveImgUpload.next(false);
        this._isActivePfxPassword.next(false);
        this._statusMessage.next("Upotreba potpisa nije odobrena od strane administratora.");
        this._statusOdobrenje.next('');
        this._statusMessageDate.next('');
        break;
      case "no_image":
        this._isActiveImgUpload.next(true);
        this._isActivePfxPassword.next(false);
        this._statusMessage.next("Upotreba potpisa je odobrena od strane administratora. Morate unijeti sliku potpisa na server.");
        this._statusOdobrenje.next('');
        this._statusMessageDate.next("Priprema potpisa u toku: unos slike");
        break;
      case "ready for certificate":
        this._isActiveImgUpload.next(false);
        this._isActivePfxPassword.next(true);
        this._statusMessage.next("Upotreba potpisa je odobrena i unijeli ste sliku potpisa. Potrebno je još da doznačite lozinku vezanu uz vaš elektronski potpis.");
        this._statusOdobrenje.next('');
        this._statusMessageDate.next("Priprema potpisa u toku: unos lozinke");
        break;
        break;
      case "certificate valid":
        this._isActiveImgUpload.next(false);
        this._isActivePfxPassword.next(false);
        this._statusMessage.next("Elektronski potpis je pripremljen i validan.");
        this._statusOdobrenje.next(_ECertificate.ecertOdobrenje ?? '');

        //let _dtValid = new Date(_ECertificate.validFrom);    
        let _validFrom = new Intl.DateTimeFormat('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false
        }).format(_ECertificate.validFrom);

        this._statusMessageDate.next("Potpis kreiran: " + _validFrom);
        break;
      default:
        this._isActiveImgUpload.next(false);
        this._isActivePfxPassword.next(false);
        this._statusMessage.next("Upotreba potpisa nije odobrena od strane administratora.");
        this._statusOdobrenje.next('');
        this._statusMessageDate.next('');
        break;
    }

  }

  getImg() {
    this._isImageLoading.next(true);
    this.restDataSource.getEcertImg(this.usersession.empId).subscribe((data: any) => {

      //let objectURL = 'data:image/jpeg;base64,' + data.image;
      //this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(objectURL);    
      //this.createImageFromBlob(data);

      let objectURL = URL.createObjectURL(data);
      // objectUrl blob:http://localhost:4200/1cf93d93-8633-4348-b2c5-377068200681
      // i downloaduje sliku ako se ovo unese u url adresu browsera 
      //console.log("epotpis.service getImg: " + objectURL);    
      this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(objectURL);

      //this.imageToShow = data;

      this._isImageLoading.next(false);
    }, error => {
      this._isImageLoading.next(false);
      console.log(error);
    });
  }

  createImageFromBlob(image: Blob) {

    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }

  }

  insECert(_password: string) {
    this.loaderService.display(true);

    //TODO: sve osim employeeID i password staviti u setings, odakle će API preuzimati podatke
    //      ovi podaci su vezani uz organizaciju  

    let _ECertificate: ECertificate = {
      employeeID: this.usersession.empId,
      subjectCN: "BHRT elektronski potpis",
      issuerCN: "BHRT issuer",
      password: _password,
      validYears: 3,      
      X509Name_C: "BA",
      // X509Name_O: "BHRT Elvir Šurković",
      X509Name_L: "Sarajevo",
      X509Name_ST: "Sarajevo",
      X509Name_E: "ecertificate@bhrt.ba"
    };


    this.restDataSource.insEcert(_ECertificate)
      .subscribe((result) => {
        console.log('insECert in service finished...' + result);

        this.loaderService.display(false);
        this.getStatus();

      },
        err => {
          console.log(err);
        });
  }

  setisActiveImgUpload(val: boolean) {
    this._isActiveImgUpload.next(val);
  }

  setisActivePfxPassword(val: boolean) {
    this._isActivePfxPassword.next(val);
  }

  isActiveImgUpload(): Observable<boolean> {
    return this._isActiveImgUpload.asObservable();
  }

  isActivePfxPassword(): Observable<boolean> {
    return this._isActivePfxPassword.asObservable();
  }

  statusMessage(): Observable<string> {
    return this._statusMessage.asObservable();
  }

  statusOdobrenje(): Observable<string> {
    return this._statusOdobrenje.asObservable();
  }

  statusMessageDate(): Observable<string> {
    return this._statusMessageDate.asObservable();
  }

  isImageLoading(): Observable<boolean> {
    return this._isImageLoading.asObservable();
  }

  isImageServExist(): Observable<boolean> {
    return this._imgServExist.asObservable();
  }  
}
