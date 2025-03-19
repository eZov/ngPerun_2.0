import { Injectable } from '@angular/core';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { OrgJed } from '../../model/orgjed.model';
import { HttpCoreService } from '../../core-services/http-core.service';

@Injectable()
export class OrgjedService {

  private lastSelOrgJed: string = '';

  private orgJed = new Subject<OrgJed>();
  public orgJedObs = this.orgJed.asObservable();

  constructor(
    private httpCoreService: HttpCoreService
  ) {
    console.log('OrgjedService constructor');
  }

  setOrgjed(_orgjed: OrgJed) {
    this.lastSelOrgJed = _orgjed.Id?.toString() || '';
    this.orgJed.next(_orgjed);
  }

  saveOrgJed(orgJed: OrgJed): Observable<any> {

    let _upd: string = "updorganizacija";
    let _ins: string = "insorganizacija";

    switch (orgJed.RowId) {
      case -1:
        let _orgJedIns = {
          "id": -1,
          "Sifra": orgJed.Id,
          "SifraNadnivo": orgJed.ParentId,
          "Naziv": orgJed.Naziv,
          "Opis": "",
          "Atribut_1": "D",
          "Opcina_1": "",
          "Opcina_2": "",
          "Banka_1": "",
          "Banka_2": "",
          "Obracun": false,
          "Uposlenici": true,
          "BrojRacuna": "",
          "BrojDjelovodni": "",
          "BrojStatisticki": "",
          "Tel": "",
          "Fax": "",
          "Email": "",
          "IdentBroj": "",
          "PorBroj": "",
          "Rjesenje": "",
          "BankaRacun_1": "",
          "BankaRacun_2": "",
          "Mjesto": "",
          "Adresa": "",
          "PTT_Broj": "",
          "PDVBroj": "",
          "Rukovodilac": 0
        }
        return this.httpCoreService.postData<boolean>(`${this.httpCoreService.baseUrl}${_ins}`, _orgJedIns).pipe(
          switchMap((value: boolean) => {
            return of(value);
          })
        )
        break;

      default:
        let _orgJedUpd = {
          id: orgJed.RowId,
          Sifra: orgJed.Id,
          SifraNadnivo: orgJed.ParentId,
          Naziv: orgJed.Naziv
        };

        return this.httpCoreService.putData<boolean>(`${this.httpCoreService.baseUrl}${_upd}`, _orgJedUpd).pipe(
          switchMap((value: boolean) => {
            return of(value);
          })
        )
    }



  }

  delOrgJed(orgJed: OrgJed): Observable<any> {

    let _sptype: string = "delOrganizacija";

    let _orgJedApi = {
      id: orgJed.RowId,
      Sifra: orgJed.Id,
      SifraNadnivo: (orgJed.ParentId == null) ? orgJed.Id : orgJed.ParentId,
      Naziv: orgJed.Naziv
    };

    return this.httpCoreService.delData(`${this.httpCoreService.baseUrl}${_sptype}`, _orgJedApi).pipe(
      switchMap((value: number) => {

        return of(value);
      }
      )
    )

  }

  getSelOrgjed(): string {
    return this.lastSelOrgJed;
  }

  getSelOrgjedPath(): string[] {

    let targetNodeId: string = this.getSelOrgjed();
    let nodes: string[] = [];
    nodes.push(targetNodeId.substring(0, 1)?targetNodeId.substring(0, 1):"");
    nodes.push(targetNodeId.substring(0, 3)?targetNodeId.substring(0, 3):"");   
    nodes.push(targetNodeId.substring(0, 5)?targetNodeId.substring(0, 5):"");
    nodes.push(targetNodeId.substring(0, 7)?targetNodeId.substring(0, 7):"");
    nodes.push(targetNodeId.substring(0, 9)?targetNodeId.substring(0, 9):"");

    return nodes;
  }

}
