import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";

import { catchError, map, Observable, of, Subject, switchMap } from "rxjs";
//import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../../shared/rest.datasource";
import { UserSessionService } from '../../core-services/user-session.service';
import { EvidDnevnik } from "../../model/evid-dnevnik.model";
import { EvidGodOdm } from "../../model/evid-gododm.model";
import { EvidSifra } from "../../model/evid-sifra.model";
import { HttpCoreService } from "../../core-services/http-core.service";
import { LoaderService } from "../../core-services/loader.service";

export interface BtnStatus {
  poslana: boolean; //HACK: false = priprema, true = poslana
  kontrola: boolean;
  locked: boolean;
}
export interface BtnPodnesi {
  id: number;
  content: string; // Podnesi - Opozovi
  cssClass: string;
  iconCss: string;
  enabled: boolean;
}
@Injectable({
  providedIn: "root",
})
export class EvidDnevnikService {

  private _eDnevnikData: EvidDnevnik[] = new Array<EvidDnevnik>();    //HACK: podaci sa servera
  public _eDnevnikDataClone!: EvidDnevnik[];                         //HACK: klon podataka, koristi se za GO

  private _eDnevnikDataSubj = new Subject<EvidDnevnik[]>();

  public _evidPrisSifra: EvidSifra[] = new Array<EvidSifra>();

  public maxNumRowsPerDay: number = 5;

  public godOdm!: EvidGodOdm;

  private godOdmObs = new Subject<EvidGodOdm>();
  private btnPodnesiObs = new Subject<BtnPodnesi>();
  private evidPrisSifraObs = new Subject<EvidSifra[]>();

  public _evdLockedExt: boolean = true;
  public _evdStop: boolean = true;
  public _sendButtOn!: boolean;
  public _saveButtonOn!: boolean;
  public _disabledButton!: boolean;
  public _podnio!: boolean;
  private _el!: EvidDnevnik;          // koristi se za sendDisableSet

  private _goYCurrIsk: number = 0;
  private _goYPrevIsk: number = 0;
  public _evidPodnesen: boolean = false;

  constructor(
    public restDataSource: RestDataSource,
    public usersession: UserSessionService,
    private loaderService: LoaderService,
    private httpCoreService: HttpCoreService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let _dt = this.usersession.firstDate;

    let _empid =
      route.params["empid"] != undefined
        ? route.params["empid"]
        : this.usersession.user.empId;
    let _MM: number =
      route.params["mm"] != undefined ? route.params["mm"] : _dt.getMonth() + 1;
    let _YYYY: number =
      route.params["yyyy"] != undefined
        ? route.params["yyyy"]
        : _dt.getFullYear();

    console.log("EvidDnevnikService: " + _empid + "-" + _MM + "-" + _YYYY);

    if (route.params['length'] > 0) {
      _empid = route.params["empid"];
      _MM = route.params["mm"];
      _YYYY = route.params["yyyy"];
    }

    //return this.restDataSource.getEvidDnevnik(_empid, _MM, _YYYY);

    let _sptype: string = "eviddnevnik";

    return this.httpCoreService.getData<EvidDnevnik[]>(`${this.httpCoreService.baseUrl}${_sptype}?vrsta=list&EmployeeID=${_empid}&mm=${_MM}&yyyy=${_YYYY}&prepare=false`).pipe(
      switchMap((value: EvidDnevnik[]) => {

        return of(value);
      }
      )
    )
  }

  getTitle(_workStation: number): string {
    console.log(
      "DnevnikService GetTtile: " + JSON.stringify(this.usersession.user)
    );
    let _title: string = _workStation === 0 ? "Dnevnik rada i odsustva " : "Evidencije ( Plan / Realizacija ) ";

    return this.usersession.user.role === "uposlenik" ? _title : "Kontrola dnevnika rada i odsustva za: ";
  }

  /* evidDnevnikData (GRID) - START  */

  get evidDnevnikDataObs(): Observable<EvidDnevnikExt[]> {
    return this._eDnevnikDataSubj as Observable<EvidDnevnikExt[]>;
  }

  set evidDnevnikDataObs(value: EvidDnevnik[]) {
    this._eDnevnikData = value;
    let _dummyDataGrid: string = JSON.stringify(this._eDnevnikData);
    this.convertToDay(_dummyDataGrid);              //HACK: konvertuje string u DateTime object

    this._elInit();                                                           //HACK: inicijalizuje _el
    this._eDnevnikDataClone = JSON.parse(JSON.stringify(this._eDnevnikData)); //HACK: klon podataka, koristi se za GO

    this._eDnevnikDataSubj.next(this.processEvidDnevnikExtData(this._eDnevnikData)); //HACK: emit podaci
  }

  get evidDnevnikData(): EvidDnevnik[] {
    return this._eDnevnikData;
  }

  set evidDnevnikData(value: EvidDnevnik[]) {
    this._eDnevnikData = value;
    let _dummyDataGrid: string = JSON.stringify(this._eDnevnikData);
    //HACK: konvertuje string u DateTime object
    this.convertToDay(_dummyDataGrid);

    // this._el = this._eDnevnikData.find(
    //   (el) => el.locked_ext === true || el.locked_ext === false
    // ) || new EvidDnevnik();
    this._elInit();

    this._eDnevnikDataClone = JSON.parse(JSON.stringify(this._eDnevnikData));
  }

  updEvidDnevnikData(
    _evidDnevnik: EvidDnevnik[],
    _superlock?: boolean): Observable<boolean> {

    let _sptype: string = "eviddnevnikwrite";;
    let _lock = (_superlock == true)
      ? "eviddnevnikwrite?pSuperLock=" + _superlock
      : "eviddnevnikwrite";

    return this.httpCoreService.postData<EvidDnevnik[]>(`${this.httpCoreService.baseUrl}${_sptype}?${_lock}`, _evidDnevnik).pipe(
      map((value: EvidDnevnik[]) => {
        this._eDnevnikData = value;
        let _dummyDataGrid: string = JSON.stringify(this._eDnevnikData);
        this.convertToDay(_dummyDataGrid);              //HACK: konvertuje string u DateTime object

        this._elInit();                                                           //HACK: inicijalizuje _el
        this._eDnevnikDataClone = JSON.parse(JSON.stringify(this._eDnevnikData)); //HACK: klon podataka, koristi se za GO

        this._eDnevnikDataSubj.next(this.processEvidDnevnikExtData(this._eDnevnikData)); //HACK: emit podaci
        return true;
      }),
      catchError((err) => {
        console.error('Error loading calendar data', err);
        return of(false);
      })
    );
  }

  refreshEvidDnevnikData(_empID: number,
    _MM: number,
    _YYYY: number,
    _ddlY: number) {
    this.loaderService.display(true);

    let _sptype: string = "eviddnevnik";;

    this.httpCoreService.getData<EvidDnevnik[]>(`${this.httpCoreService.baseUrl}${_sptype}?vrsta=list&EmployeeID=${_empID}&mm=${_MM}&yyyy=${_YYYY}&prepare=false`).subscribe({
      next: (value: EvidDnevnik[]) => {
        this.evidDnevnikDataObs = value;

        this.sendDisableSet();
        this.getGoStatus(_empID, _ddlY);

        this.loaderService.display(false);
      },
      error: (err) => {
        console.error("Error loading GO data", err);
        this.loaderService.display(false);
      }
    });


  }

  /* evidDnevnikData (GRID) - END  */


  setEvidPrisSifra(value: EvidSifra[]) {
    this._evidPrisSifra = value;

    this._evidPrisSifra.forEach((val) => {
      if (val.sifra == "RRK") val.title = "** " + val.title;
    });

    this.evidPrisSifraObs.next(this._evidPrisSifra);
  }

  get evidDnevnikDataGrid(): EvidDnevnik[] {
    return this._eDnevnikData.map((res) => {
      if (res.vrijeme_od === res.vrijeme_do && res.vrijeme_od === "00:00") {
        res.vrijeme_od = "";
        res.vrijeme_do = "";
      }
      // Šifarnik sadrži samo GO, a ne GO-2020
      if (res.sifra_placanja || ''.indexOf("GO") != -1) {
        res.sifra_placanja = "GO";
      }
      return res;
    });
  }

  // Procesira datum u string formatu i konvertuje ga u DateTime objekat
  private convertToDay(_dummyDataGrid: string) {
    this._eDnevnikData = JSON.parse(_dummyDataGrid, (field, value) => {
      let dupValue: string = value;
      if (
        typeof value === "string" &&
        /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*){1})([zZ]|([+\-])(\d\d):?(\d\d))?$/.test(
          value
        )
      ) {
        let arr = dupValue.split(/[^0-9]/);

        let dt = new Date();
        dt = new Date(
          Date.UTC(
            parseInt(arr[0], 10),
            parseInt(arr[1], 10) - 1,
            parseInt(arr[2], 10),
            parseInt(arr[3], 10),
            parseInt(arr[4], 10),
            parseInt(arr[5], 10)
          )
        );
        dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());

        return dt;
      } else {
        return value;
      }
    });

    this._goYCurrIsk = 0;
    this._goYPrevIsk = 0;
  }

  private _elInit() {
    this._el = this._eDnevnikData.find(
      (el) => el.locked_ext === true || el.locked_ext === false
    ) || new EvidDnevnik();
  }

  public sendDisableSet() {
    //let _el: EvidDnevnik = this._evidDnevnikData.find(el => el.locked_ext === true || el.locked_ext === false);
    let _el: EvidDnevnik = this._el;

    this._evdLockedExt = _el.locked_ext || false;
    this._evdStop = _el.evd_kontrolisao || 0 > 0 ? true : false;
    this._podnio = _el.evd_podnio || 0 > 0 ? true : false;
    this._sendButtOn = !(this._evdLockedExt || this._podnio);

    let _btnPodnesi: BtnPodnesi = {
      id: 0,
      content: "Podnesi",
      cssClass: "btn-block e-primary",
      iconCss: "e-btn-sb-icon sf-icon-mail-all-wf",
      enabled: true,
    };

    let _btnOpozovi: BtnPodnesi = {
      id: 0,
      content: "Opozovi",
      cssClass: "btn-block e-danger",
      iconCss: "e-btn-sb-icon sf-icon-mail-delete-wf",
      enabled: true,
    };

    switch (this.usersession.user.role) {
      case "uposlenik": {
        if (_el.locked_ext == false && _el.evd_podnio == 0) {
          _btnPodnesi.enabled = true;
          this.setBtnPodnesi(_btnPodnesi); // status = 1
          this._evidPodnesen = false;
        } else if (
          _el.locked_ext == false &&
          _el.evd_podnio || 0 > 0 &&
          _el.evd_kontrolisao == 0
        ) {
          _btnOpozovi.enabled = true;
          this.setBtnPodnesi(_btnOpozovi); // status = 2
          this._evidPodnesen = true;
        } else if (_el.locked_ext == true) {
          _btnOpozovi.enabled = false;
          this.setBtnPodnesi(_btnOpozovi); // status = 3
          this._evidPodnesen = true;
        } else if (
          _el.locked_ext == false &&
          _el.evd_podnio || 0 > 0 &&
          _el.evd_kontrolisao || 0 > 0
        ) {
          _btnOpozovi.enabled = false;
          this.setBtnPodnesi(_btnOpozovi); // status = 3
          this._evidPodnesen = true;
        }
        break;
      }
      case "sekretarica": {
        if (
          _el.locked_ext == false &&
          _el.evd_kontrolisao == 0 &&
          _el.evd_podnio == 0
        ) {
          _btnPodnesi.enabled = false;
          this.setBtnPodnesi(_btnPodnesi); // status = 1
          this._evidPodnesen = false;
        } else if (
          _el.locked_ext == false &&
          _el.evd_kontrolisao == 0 &&
          _el.evd_podnio || 0 > 0
        ) {
          _btnOpozovi.enabled = false;
          this.setBtnPodnesi(_btnOpozovi); // status = 2
          this._evidPodnesen = true;
        } else if (
          _el.locked_ext == false &&
          _el.evd_kontrolisao || 0 > 0 &&
          _el.evd_podnio == 0
        ) {
          _btnPodnesi.enabled = true;
          this.setBtnPodnesi(_btnPodnesi); // status = 1
          this._evidPodnesen = false;
        } else if (
          _el.locked_ext == false &&
          _el.evd_kontrolisao || 0 > 0 &&
          _el.evd_podnio || 0 > 0
        ) {
          _btnOpozovi.enabled = true;
          this.setBtnPodnesi(_btnOpozovi); // status = 3
          this._evidPodnesen = true;
        } else if (_el.locked_ext == true && _el.evd_podnio || 0 > 0) {
          _btnOpozovi.enabled = false;
          this.setBtnPodnesi(_btnOpozovi); // status = 3
          this._evidPodnesen = true;
        } else if (_el.locked_ext == true && _el.evd_podnio == 0) {
          _btnPodnesi.enabled = false;
          this.setBtnPodnesi(_btnPodnesi); // status = 1
          this._evidPodnesen = false;
        }
        break;
      }
    }
  }

  setGodOdm(value: EvidGodOdm) {
    this.godOdm = value;
    this._goYPrevIsk = this.godOdm.yprev_isk || 0;
    this._goYCurrIsk = this.godOdm.ycurr_isk || 0;

    if (this._eDnevnikDataClone != undefined && this._evidPodnesen == false) {
      if (this.godOdm != undefined) {
        if (this.godOdm.yprev_isk != undefined) {
          this.godOdm.yprev_isk += this._eDnevnikDataClone.filter((el) =>
            (el.sifra_placanja || '').startsWith("GO-" + (this.godOdm.ycurr || 0 - 1))
          ).length;
        }
        if (this.godOdm.ycurr_isk != undefined) {
          this.godOdm.ycurr_isk += this._eDnevnikDataClone.filter((el) =>
            (el.sifra_placanja || '').startsWith("GO-" + this.godOdm.ycurr)
          ).length;
        }
      }

      this.godOdmObs.next(this.godOdm);
    }
  }

  getGodOdm(): Observable<EvidGodOdm> {
    return this.godOdmObs.asObservable();
  }

  getGoStatus(_empID: number, _YYYY: number) {
    let _sptype: string = "EvidGodOdm";

    this.httpCoreService.getData<EvidGodOdm>(`${this.httpCoreService.baseUrl}${_sptype}?vrsta=ins&EmployeeID=${_empID}&yyyy=${_YYYY}`).subscribe({
      next: (value: EvidGodOdm) => {
        this.setGodOdm(value);

        this.loaderService.display(false);
      },
      error: (err) => {
        console.error("Error loading GO data", err);
        this.loaderService.display(false);
      }
    });
  }



  setBtnPodnesi(value: BtnPodnesi) {
    this.btnPodnesiObs.next(value);
  }

  getBtnPodnesi(): Observable<BtnPodnesi> {
    return this.btnPodnesiObs.asObservable();
  }

  getEvidPrisSifra = (): Observable<EvidSifra[]> => {
    return this.evidPrisSifraObs.asObservable();
  };

  public setGoOrder(_eDnevnikDataChanged: EvidDnevnik[]): EvidDnevnik[] {
    for (let _recChanged of _eDnevnikDataChanged) {
      if (_recChanged.sifra_placanja || ''.startsWith("GO")) continue;

      //HACK: bez obzira što je datum string, toString metod vraća neki DateTime oblik - ZATO se MORA koristiti
      // .toISOString() - da se dobije format stringa koji sa nalazi u polju datum: :"2020-07-06T10:00:00.000Z"
      let _datumChanged: string = new Date(_recChanged.datum || '').toISOString();
      let _recsOld = this._eDnevnikDataClone.find(
        (el) => el.datum === _datumChanged && el.sifra_placanja || ''.startsWith("GO")
      );

      //HACK: _recsOld je referenca na red u tabeli, zato se ovdje može mijenjati vrijednost
      if (_recsOld != undefined) {
        _recsOld.sifra_placanja = _recChanged.sifra_placanja;
        if (_recChanged.opis_rada != undefined) {
          _recChanged.opis_rada = _recChanged.opis_rada.replace(_recsOld.opis_rada || '', "");
        }
      }
    }

    // GO u this._eDnevnikData - nakon što su ažurirani uklonjeni GO
    let _ycurr: number = this.godOdm.ycurr || 0;
    let _ycurr_rjes: number = this.godOdm.ycurr_rjes || 0;
    let _yprev_rjes: number = this.godOdm.yprev_rjes || 0;

    let _ycurr_isk: number = this._goYCurrIsk;
    let _yprev_isk: number = this._goYPrevIsk;

    //console.log("setGoOrder-nedirnuti podaci: " + JSON.stringify(this._eDnevnikDataClone));
    _yprev_isk += this._eDnevnikDataClone.filter((el) =>
      el.sifra_placanja || ''.startsWith("GO-" + (_ycurr - 1))
    ).length;

    _ycurr_isk += this._eDnevnikDataClone.filter((el) =>
      el.sifra_placanja || ''.startsWith("GO-" + _ycurr)
    ).length;

    for (let _eDnevnik of _eDnevnikDataChanged.filter((el) =>
      el.sifra_placanja || ''.startsWith("GO")
    )) {
      if (_yprev_rjes - _yprev_isk > 0) {
        _eDnevnik.sifra_placanja = "GO-" + (_ycurr - 1);
        _eDnevnik.opis_rada = _eDnevnik.sifra_placanja;
        _yprev_isk += 1;
      } else if (_ycurr_rjes - _ycurr_isk > 0) {
        _eDnevnik.sifra_placanja = "GO-" + _ycurr;
        _eDnevnik.opis_rada = _eDnevnik.sifra_placanja;
        _ycurr_isk += 1;
      }
    }

    return _eDnevnikDataChanged;
  }

  /*  izmjene, dodan EvidDnevnikExt...    */

  public evidDnevnikExtData!: EvidDnevnikExt[];

  protected convertToDateTime(_dummyDataGrid: string): EvidDnevnikExt[] {
    //HACK DateTime konverzija - bez ovoga Grid tretira kolonu kao string

    return JSON.parse(_dummyDataGrid, (field, value) => {
      let dupValue: string = value;
      if (
        typeof value === "string" &&
        /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*){1})([zZ]|([+\-])(\d\d):?(\d\d))?$/.test(
          value
        )
      ) {
        let arr = dupValue.split(/[^0-9]/);

        let dt = new Date();
        dt = new Date(
          Date.UTC(
            parseInt(arr[0], 10),
            parseInt(arr[1], 10) - 1,
            parseInt(arr[2], 10),
            parseInt(arr[3], 10),
            parseInt(arr[4], 10),
            parseInt(arr[5], 10)
          )
        );
        dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());

        return dt;
      } else {
        return value;
      }
    });
  }

  public processEvidDnevnikExtData = (_evidDnevnikData: EvidDnevnik[]) => {
    /* START old code: set evidDnevnikData(value: EvidDnevnik[])  */

    this._eDnevnikData = _evidDnevnikData;

    let _dummyDataGrid: string = JSON.stringify(this._eDnevnikData);
    this.evidDnevnikExtData = this.convertToDateTime(_dummyDataGrid);

    this._goYCurrIsk = 0;
    this._goYPrevIsk = 0;

    // this._el = this._eDnevnikData.find(
    //   (el) => el.locked_ext === true || el.locked_ext === false
    // ) || new EvidDnevnik();
    this._elInit();

    this._eDnevnikDataClone = JSON.parse(JSON.stringify(this._eDnevnikData));

    /* END old code */

    return this.evidDnevnikExtData.map((res) => {
      if (res.vrijeme_od === res.vrijeme_do && res.vrijeme_od === "00:00") {
        res.vrijeme_od = "";
        res.vrijeme_do = "";
      }
      // Šifarnik sadrži samo GO, a ne GO-2020
      if ((res.sifra_placanja || '').indexOf("GO") != -1) {
        res.sifra_placanja = "GO";
      }

      if (
        (res.sifra_placanja == "RRD" || res.sifra_placanja == "RRK") &&
        res.locked == false
      ) {
        res.button = res.keyday == true ? 1 : 2;
      } else {
        res.button = 0;
      }

      return res;
    });
  };

  /* 
  Provjera preklapanja evidencija pna istom danu
  _evidDne - svi redovi u tom danu (bez redova kojima se provjerava vrijeme)
  _changed - redovi koji se provjeravaju (vrijeme_od, vrijeme_do)
  _retVal - true - preklapanje, false - nema preklapanja
  */
  public checkOverlapByDay = (
    _evidDne: EvidDnevnik[],
    _changed: { vrijeme_od?: string; vrijeme_do?: string }
  ): boolean => {
    let _retVal: boolean = false;

    _evidDne.forEach((value) => {
      // console.log(`checkOverlap: 0 ...${JSON.stringify(value)}`);
      // console.log(`checkOverlap: 1 ...${JSON.stringify(+(_changed.vrijeme_od || '').replace(":", ""))}-${JSON.stringify(+(_changed.vrijeme_do || '').replace(":", ""))}`);
      // console.log(`checkOverlap: 2 ...${JSON.stringify(+(value.vrijeme_od || '').replace(":", ""))}-${JSON.stringify(+(value.vrijeme_do || '').replace(":", ""))}`);

      if (
        +(_changed.vrijeme_od || '').replace(":", "") > +(_changed.vrijeme_do || '').replace(":", "")
      ) {
        _retVal = true;
      }

      if (
        // (StartA <= EndB)  and  (EndA >= StartB)
        +(_changed.vrijeme_od || '').replace(":", "") < +(value.vrijeme_do || '').replace(":", "") &&
        +(_changed.vrijeme_do || '').replace(":", "") > +(value.vrijeme_od || '').replace(":", "")
      ) {
        _retVal = true;
      }
    }, this);

    return _retVal;
  };

  public checkOverlapByMonth = (
    _eDneCurrent: EvidDnevnik[],                 // tabela svih evidencija u datom mjesecu (TEKUĆA tabela)
    _eDneChanged: EvidDnevnik[],          // tabela koja se kontroliše (CHANGED + ADDED + DELETED)
    _rowsCounted: number[]
  ): boolean => {
    /*
    (1) locirati samo redove RRD, RRK ili SP koji imaju vise od jednog reda
    (2) unutar redova sa istim datumom izvrsiti provjeru vremena
    
    */

    let _retVal: boolean = false;

    // tabela svih evidencija u datom mjesecu sa : RRD, RRK, SP
    let _eDneCurrentCloned: EvidDnevnik[] = [];

    // tabela koja se kontroliše sa: RRD, RRK, SP
    let _eDneChangedFilt = _eDneChanged.filter(
      (e) =>
        e.sifra_placanja == "RRD" ||
        e.sifra_placanja == "RRK" ||
        e.sifra_placanja == "SP"
    );

    // prepisuju se samo redovi koji sadrže RAD - 
    _eDneCurrent.forEach((el) => {
      if (
        el.sifra_placanja == "RRD" ||
        el.sifra_placanja == "RRK" ||
        el.sifra_placanja == "SP"
      ) {
        _eDneCurrentCloned.push(Object.assign({}, el));
      }
    });

    // Prepiši sve redove koji su promijenjeni u tekućem mjesecu
    _eDneCurrentCloned.forEach((el) => {
      if (
        el.sifra_placanja == "RRD" ||
        el.sifra_placanja == "RRK" ||
        el.sifra_placanja == "SP"
      ) {
        _eDneChanged.forEach((e) => {
          if (e.datum === el.datum && (e.id = el.id)) {
            console.log(`checkOverlapByMonth: 0a (changed): ${e.datum} ... (${el.id}) `);
            console.log(`checkOverlapByMonth: 0b (changed): ${el.vrijeme_od} ... (${e.vrijeme_od}) `);
            console.log(`checkOverlapByMonth: 0c (changed): ${el.vrijeme_do} ... (${e.vrijeme_do}) `);
            el.vrijeme_od = e.vrijeme_od;
            el.vrijeme_do = e.vrijeme_do;
          }
        });
      }
    });

    console.log(`checkOverlapByMonth 1: ${JSON.stringify(_eDneCurrentCloned)}`);

    _eDneChangedFilt.forEach((eChanged) => {
      let _dateChanged = new Date(eChanged.datum || '');

      if (_rowsCounted[_dateChanged.getDate()] > 1) {
        console.log(`checkOverlapByMonth: 2 ..." + ${JSON.stringify(eChanged.datum)} - ${JSON.stringify(eChanged.vrijeme_od)} - ${JSON.stringify(eChanged.vrijeme_do)}`);

        let _eDneClonedFiltered = _eDneCurrentCloned.filter((eCurrent) => {
          var dCurrent = new Date(eCurrent["datum"] || '');
          var dChanged = new Date(eChanged["datum"] || '');
          //console.log(`checkOverlapByMonth: 2a ..." + ${JSON.stringify(dCurrent)} - ${JSON.stringify(dChanged)}`);

          /* Kontrola: ako su isti dani da id različiti => GREŠKA. Ovo važi samo ako nema multi redova po danu */
          // HACK: ovdje uvesti kontrolu ako je isti  i da je sifra placanja različita => GREŠKA
          // if (d1.getDate() == _dateChanged.getDate() && eChanged.id != eCurrent.id) _retVal = true;
          // return _retVal;
          return (dCurrent.getDate() == dChanged.getDate()) && (eCurrent.id != eChanged.id);
        });
        console.log("checkOverlapByMonth: 3 ..." + JSON.stringify(_eDneClonedFiltered));

        _retVal = this.checkOverlapByDay(_eDneClonedFiltered, {
          vrijeme_od: eChanged.vrijeme_od,
          vrijeme_do: eChanged.vrijeme_do,
        });
        console.log("checkOverlapByMonth: 4 ..." + _retVal);
      }
    }, this);

    return _retVal;
  };
}

export class EvidDnevnikExt extends EvidDnevnik {
  constructor(public button?: number) {
    super();
  }
}
