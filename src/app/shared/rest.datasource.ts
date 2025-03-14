import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from '../env.service';

import { Observable, throwError } from "rxjs";
import { Putnal } from "../model/putnal.model";
import { PutnalDetail } from "../model/putnaldetail.model";
import { Employee } from '../model/employee.model';

import { catchError, map } from "rxjs/operators";
import { Esignature } from '../model/esignature.model';
import { Protokol } from '../model/protokol.model';
import { AdmEmployee } from '../model/adm-employees.model';
import { OrgJed } from '../model/orgjed.model';
import { AdmEmployeeOrgrole } from '../model/adm-employee-orgrole.model';
import { AdmUser } from '../model/adm-user.model';
import { AdmUserRoles } from '../model/adm-user-roles.model';
import { Aktivnost } from '../model/aktivnost.model';
import { EmployeeRec } from '../model/employeerec.model';
import { Opcina } from '../model/opcina.model';
import { EvidSifra } from '../model/evid-sifra.model';
import { EvidDnevnik } from '../model/evid-dnevnik.model';
import { EvidGodOdm } from '../model/evid-gododm.model';
import { EvidDnStatus } from '../model/evid-dnstatus.model';
import { ECertificate } from "../model/e-certificate.model";
import { EsignatureByCert } from "../model/esignature-by-cert.model";
import { EmailTemplate } from "../model/email-template.model";
import { APIversion } from "../model/api-version.model";
import { PutnalPrilog } from "../model/putnalprilog.model";
import { Person } from "../model/person.model";
import { PersonUnion } from "../model/person-union.model";
import { ProtokolEvid } from "../model/protokol-evid.model";
import { ProtokolPrava } from "../model/protokol-prava.model";
import { StickyDirection } from "@angular/cdk/table";
import { PutnalStatus2 } from "../model/putnal-status2.model";

// export const REST_URL = new InjectionToken("rest_url");

// const PROTOCOL = "http";
// const PORT = 80;
const PROTOCOL = "https";
const PORT = 443;
@Injectable()
export class RestDataSource {
  baseUrl: string;
  auth_token!: string;
  sptype!: string;

  constructor(
    private env: EnvService,
    private http: HttpClient // @Inject(REST_URL) private url: string
  ) {
    //this.baseUrl = `${PROTOCOL}://${url}:${PORT}/api/jwtputnal/`;
    this.baseUrl = this.env.apiUrl;
  }

  checkIfCoreApiIsAvailable() {
    this.sptype = "getAPIver";
    return this.http.get<APIversion>(`${this.baseUrl}${this.sptype}`);    
}
  
  private getOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
      }),
    };
  }

  private getOptionsBlob() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
        "Content-Type": "image/png",
      }),
      responseType: "blob" as "json",
    };
  }

  private getOptionsByContent(contentType: string) {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth_token}`,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      }),
      responseType: "blob" as "json",
    };
  }

  private sendHttpReq<T>(verb: string, url: string, body?: any): Observable<T> {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);

    return this.http
      .request<T>(verb, url, {
        body: body,
        headers: myHeaders,
      })
      .pipe(
        catchError((error: Response) =>
          throwError(`Network Error: ${error.statusText} (${error.status})`)
        )
      );
  }

  private sendHttpRequest<T>(
    verb: string,
    url: string,
    body?: Putnal
  ): Observable<T> {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);

    return this.http
      .request<T>(verb, url, {
        body: body,
        headers: myHeaders,
      })
      .pipe(
        catchError((error: Response) =>
          throwError(`Network Error: ${error.statusText} (${error.status})`)
        )
      );
  }

  // API url koristi pdf viewer
  public urlAPI() {
    return this.baseUrl;
  }

  // API wLI1 login
  authenticate(user: string, pass: string): Observable<boolean> {
    return this.http
      .post<any>(this.baseUrl + "login", {
        email: user,
        password: pass,
        role: "uposlenik",
      })
      .pipe(
        map((response) => {
          this.auth_token = response.success ? response.token : null;
          return response.success;
        })
      );
  }

  debugAuthenticate(user: string, pass: string): Observable<boolean> {
    return this.http
      .post<any>(this.baseUrl + "login", {
        email: "jasminko.besic@bhrt.ba",
        password: "demo96",
        role: "likvidatura",
      })
      .pipe(
        map((response) => {
          this.auth_token = response.success ? response.token : null;
          return response.success;
        })
      );
  }

  //API:aUL1 lista uposlenika sa podacima o pristupu portalu
  menusbyrole(): Observable<{ [key: string]: Object }[]> {
    this.sptype = "menus";
    return this.sendHttpReq<{ [key: string]: Object }[]>(
      "GET",
      `${this.baseUrl}${this.sptype}`
    );
  }

  // API wLI2 promjena role
  authrole(role: string): Observable<boolean> {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);

    return this.http
      .post<any>(
        this.baseUrl + "authrole",
        {
          email: "",
          password: "",
          role: role,
        },
        { headers: myHeaders }
      )
      .pipe(
        map((response) => {
          this.auth_token = response.success ? response.token : null;
          return response.success;
        })
      );
  }

  //API:P1 promjena passworda
  changepassword(
    _email: string,
    _oldPass: string,
    _newPass: string
  ): Observable<boolean> {
    this.sptype = "changepassword";

    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);

    return this.http.post<any>(
      this.baseUrl + this.sptype + "?pSendEmail=true",
      {
        email: _email,
        password: _newPass,
        role: _oldPass,
      },
      { headers: myHeaders }
    );
  }

  //API:P1 promjena passworda
  resetpassword(_email: string): Observable<String> {
    this.sptype = "resetpassword";

    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);

    return this.http.post<any>(
      this.baseUrl + this.sptype + "?pSendEmail=true",
      {
        email: _email,
      },
      { headers: myHeaders }
    );
  }

  //API:aUC kreiraj usera
  createUser(_employeeId: number, _email: string): Observable<AdmEmployee[]> {
    this.sptype = "createuser";

    return this.sendHttpReq<AdmEmployee[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?pEmail=${_email}&pEmployeeId=${_employeeId}&pSendEmail=true`
    );
  }

  //API:aUW set web access za usera
  setWebAccess(_email: string, _webaccess: boolean): Observable<AdmEmployee[]> {
    this.sptype = "setwebaccess";

    return this.sendHttpReq<AdmEmployee[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?pEmail=${_email}&pWebAccess=${_webaccess}`
    );
  }

  //API:aUW set web access za usera
  delMobAccess(_email: string): Observable<boolean> {
    this.sptype = "deleteuser";

    return this.sendHttpReq<boolean>(
      "GET",
      `${this.baseUrl}${this.sptype}?pEmail=${_email}&pMobUser=true`
    );
  }

  //API:aUL1 lista uposlenika sa podacima o pristupu portalu
  listAdmEmployees(_org: string): Observable<AdmEmployee[]> {
    this.sptype = "getemployeelist";

    return this.sendHttpReq<AdmEmployee[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?list=${_org}&vrsta=1`
    );
  }

  //API:aUL1 lista uposlenika sa podacima o pristupu portalu
  listAdmEmployeesBySifra(
    _org: string,
    _sifra: string
  ): Observable<AdmEmployee[]> {
    this.sptype = "getemployeelist";

    return this.sendHttpReq<AdmEmployee[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?list=${_org}&sifra=${_sifra}`
    );
  }

  //API:aUL1 lista uposlenika sa podacima o pristupu portalu
  listAdmEmployeesRoles(_org: string): Observable<AdmUserRoles[]> {
    this.sptype = "getemployeeroleslist";

    return this.sendHttpReq<AdmUserRoles[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?list=${_org}`
    );
  }

  //API:aUOL1 lista uposlenika sa podacima o org. rolama pristupu portalu
  listAdmEmployeesOrgRoles(_org: string): Observable<AdmEmployeeOrgrole[]> {
    this.sptype = "getemployeeorgroleslist";

    return this.sendHttpReq<AdmEmployeeOrgrole[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?list=${_org}`
    );
  }

  //HACK Role i org role - API pozivi

  //API:esD1 deaktiviraj (set=0) public key - ukini epotpis
  setdmEmployeeRoles(_userRoles: AdmUserRoles): Observable<boolean> {
    this.sptype = "setroles";

    return this.sendHttpReq<boolean>(
      "POST",
      `${this.baseUrl}${this.sptype}`,
      _userRoles
    );
  }

  //API:aUOS lista uposlenika sa podacima o org. rolama pristupu portalu
  setdmEmployeeOrgRoles(_admUser: AdmUser): Observable<boolean> {
    this.sptype = "orgrolewrite";

    return this.sendHttpReq<boolean>(
      "POST",
      `${this.baseUrl}${this.sptype}`,
      _admUser
    );
  }

  //API:oL1 lista org.jed. za TreeView
  listOrgJed(_org: string): Observable<OrgJed[]> {
    this.sptype = "getorganizacijalist";

    return this.sendHttpReq<OrgJed[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?list=${_org}`
    );
  }

  //API:oL1 lista org.jed. za TreeView
  listOrgJedNum(): Observable<OrgJed[]> {
    this.sptype = "getorganizacijalist";

    return this.sendHttpReq<OrgJed[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?list=all&numeric=true`
    );
  }

  //API:oL1 lista org.jed. za TreeView
  listEmailTemplates(): Observable<EmailTemplate[]> {
    this.sptype = "GetEmailTemplatesList";

    return this.sendHttpReq<EmailTemplate[]>(
      "GET",
      `${this.baseUrl}${this.sptype}`
    );
  }

  //API administracija epotpisa
  //API:esUL1 lista uposlenika sa podacima o epotpisu i epotpisniku
  listAdmEmployeesEsign(_org: string): Observable<AdmEmployee[]> {
    this.sptype = "esignemployeelist";

    return this.sendHttpReq<AdmEmployee[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?list=${_org}`
    );
  }

  //API:esRD ready to get public key
  setEsignReady(_empId: number): Observable<boolean> {
    this.sptype = "esignready";

    return this.sendHttpReq<boolean>(
      "GET",
      `${this.baseUrl}${this.sptype}?pEmployeeId=${_empId}`
    );
  }

  //API:esD1 deaktiviraj (set=0) public key - ukini epotpis
  setEsignDel(esign: Esignature): Observable<boolean> {
    this.sptype = "esigndel";

    return this.sendHttpReq<boolean>(
      "POST",
      `${this.baseUrl}${this.sptype}`,
      esign
    );
  }

  //API:esAK  postavi kao epotpisnika
  setEsignPotpisnik(_empId: number): Observable<boolean> {
    this.sptype = "esignauthorize";
    return this.sendHttpReq<boolean>(
      "GET",
      `${this.baseUrl}${this.sptype}?pEmployeeId=${_empId}`
    );
  }

  //API:esAD  ukini kao epotpisnika
  setEsignDelPotpisnik(_empId: number): Observable<boolean> {
    this.sptype = "esigndelauthorize";
    return this.sendHttpReq<boolean>(
      "GET",
      `${this.baseUrl}${this.sptype}?pEmployeeId=${_empId}`
    );
  }

  //API:L1
  getPutnalByData(
    empid: number,
    days: number,
    status: string
  ): Observable<Putnal[]> {
    this.sptype = "putnals";
    return this.http.get<Putnal[]>(
      this.baseUrl +
        `${this.sptype}?pEmpID=${empid}&days=${days}&status=${status}`,
      this.getOptions()
    );
  }
  /* getPutniNalsByOrgRole API-L2 */
  // API L2
  getPutnalByOrgRole(
    list: string,
    days: number,
    status: string,
    createdby: number,
    pndoc: number = -1,
    vrsta: string = "0,1"    
  ): Observable<Putnal[]> {
    this.sptype = "putnalsbyorgrole";
    return this.http.get<Putnal[]>(
      this.baseUrl +
        `${this.sptype}?list=${list}&days=${days}&status=${status}&createdby=${createdby}&vrsta=${vrsta}&pndoc=${pndoc}`,
      this.getOptions()
    );
  }

  // API L2
  getPutnalByOrgRoleExt(
    list: string,
    days: number,
    status: string,
    createdby: number,
    pndoc: number = -1
  ): Observable<Putnal[]> {
    this.sptype = "putnalsbyorgrole";
    return this.http.get<Putnal[]>(
      this.baseUrl +
        `${this.sptype}?list=${list}&days=${days}&status=${status}&createdby=${createdby}&ext=S&pndoc=${pndoc}`,
      this.getOptions()
    );
  }

  // API L2
  // Lista za pregled do blagajne i od blagajne
  getPutnalByOrgRolepl(
    list: string,
    days: number,
    status: string,
    createdby: number,
    pndoc: number = -1
  ): Observable<Putnal[]> {
    this.sptype = "putnalsbyorgrole";
    return this.http.get<Putnal[]>(
      this.baseUrl +
        `${this.sptype}?list=${list}&days=${days}&status=${status}&createdby=${createdby}&pndoc=${pndoc}`,
      this.getOptions()
    );
  }

  // API L2
  getPutnalByOrgRoleExtpl(
    list: string,
    days: number,
    status: string,
    createdby: number,
    pndoc: number = -1
  ): Observable<Putnal[]> {
    this.sptype = "putnalsbyorgrole";
    return this.http.get<Putnal[]>(
      this.baseUrl +
        `${this.sptype}?list=${list}&days=${days}&status=${status}&createdby=${createdby}&pndoc=${pndoc}&vrsta=10,11`,
      this.getOptions()
    );
  }

  // API L1, L2
  getPutnalByList(
    _bylist: string,
    days: number,
    status: string,
    createdby: number,
    pndoc: number,
    vrsta: string = "0,1"     
  ): Observable<Putnal[]> {
    switch (_bylist) {
      case "byorgpg": {
        return this.getPutnalByOrgRole("byorgpg", days, status, -1, pndoc, vrsta);
      }
      case "byupo": {
        return this.getPutnalByOrgRole("byorgpg", days, status, createdby, pndoc, vrsta);
      }
      default: {
        return throwError(`Invalid list type: ${_bylist}`);
      }
    }
  }

  getPutnalByOrgPG(
    _bylist: string,
    days: number,
    status: string,
    createdby: number,
    pndoc: number,
    vrsta: string = "0,1"     
  ): Observable<Putnal[]> {
        return this.getPutnalByOrgRole("byorgpg", days, status, createdby, pndoc, vrsta);
  }

  // API L1, L2
  getPutnalByListExt(
    _bylist: string,
    days: number,
    status: string,
    createdby: number
  ): Observable<Putnal[]> {
    switch (_bylist) {
      case "byorgpg": {
        return this.getPutnalByOrgRoleExt(_bylist, days, status, createdby);
        break;
      }
      case "byupo": {
        return this.getPutnalByData(-1, days, status);
        break;
      }
      default: {
        return throwError(`Invalid list type: ${_bylist}`);
        break;
      }
    }
  }

  // API L1, L2
  getPutnalByListpl(
    _bylist: string,
    days: number,
    status: string,
    createdby: number,
    _pndoc: number
  ): Observable<Putnal[]> {
    switch (_bylist) {
      case "byorgpg": {
        return this.getPutnalByOrgRolepl(
          _bylist,
          days,
          status,
          createdby,
          _pndoc
        );
        break;
      }
      case "byupo": {
        return this.getPutnalByData(-1, days, status);
        break;
      }
      default: {
        return throwError(`Invalid list type: ${_bylist}`);
        break;
      }
    }
  }

  // API L1, L2
  getPutnalByListExtpl(
    _bylist: string,
    days: number,
    status: string,
    createdby: number
  ): Observable<Putnal[]> {
    switch (_bylist) {
      case "byorgpg": {
        return this.getPutnalByOrgRoleExtpl(_bylist, days, status, createdby);
        break;
      }
      case "byupo": {
        return this.getPutnalByData(-1, days, status);
        break;
      }
      default: {
        return throwError(`Invalid list type: ${_bylist}`);
        break;
      }
    }
  }

  // API L6
  getPutnalIzv(id: number): Observable<Putnal> {
    this.sptype = "putnalsizv";
    return this.sendHttpRequest<Putnal>(
      "GET",
      `${this.baseUrl}${this.sptype}?pPutNalID=${id}`
    );
  }

  // API C1
  savePutnal(Putnal: Putnal): Observable<Putnal> {
    this.sptype = "putnalsins";
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);
    myHeaders = myHeaders.set("Content-Type", `application/json`);

    let body = JSON.stringify(Putnal);

    return this.sendHttpRequest<Putnal>(
      "POST",
      `${this.baseUrl}/${this.sptype}`,
      Putnal
    );
  }

  // API S2
  updatePutnal(Putnal: Putnal): Observable<Putnal> {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);
    myHeaders = myHeaders.set("Content-Type", `application/json`);

    let body = JSON.stringify(Putnal);

    // API S2
    return this.http
      .post<Putnal>(this.baseUrl + "putnalwrite?action=nalog", Putnal, {
        headers: myHeaders,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );

    // this.sptype = "putnals";
    // return this.sendSPRequest<Putnal>("PUT",
    // `${this.baseUrl}/${this.sptype}/${Putnal.id}`, Putnal);
  }

  updatePutnalGroup(_ids: string, Putnal: Putnal): Observable<Putnal> {
    this.sptype = "putnalwritegroup?action=akontacija";
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);
    myHeaders = myHeaders.set("Content-Type", `application/json`);

    let body = JSON.stringify(Putnal);

    return this.http
      .request<Putnal>("POST", `${this.baseUrl}/${this.sptype}&ids=${_ids}`, {
        body: body,
        headers: myHeaders,
      })
      .pipe(
        catchError((error: Response) =>
          throwError(`Network Error: ${error.statusText} (${error.status})`)
        )
      );
  }

  updatePutnalBlagajna(id: number, Putnal: Putnal): Observable<Putnal> {
    this.sptype = "putnalwriteblagajna";
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);
    myHeaders = myHeaders.set("Content-Type", `application/json`);

    let body = JSON.stringify(Putnal);

    return this.http
      .request<Putnal>(
        "POST",
        `${this.baseUrl}/${this.sptype}?pPutNalID=${id}`,
        {
          body: body,
          headers: myHeaders,
        }
      )
      .pipe(
        catchError((error: Response) =>
          throwError(`Network Error: ${error.statusText} (${error.status})`)
        )
      );
  }

  // API S1
  updateStatusPutnal(Putnal: Putnal): Observable<Putnal> {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);
    myHeaders = myHeaders.set("Content-Type", `application/json`);

    let body = JSON.stringify(Putnal);

    return this.http
      .post<Putnal>(this.baseUrl + "putnalwrite?action=status", Putnal, {
        headers: myHeaders,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  // API S1 - isplata akontacije
  updateAkontacijaPutnal(Putnal: Putnal): Observable<Putnal> {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);
    myHeaders = myHeaders.set("Content-Type", `application/json`);

    let body = JSON.stringify(Putnal);

    return this.http
      .post<Putnal>(
        this.baseUrl + "putnalwrite?action=ispl_akontacije",
        Putnal,
        { headers: myHeaders }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  // API ??
  deletePutnal(id: number): Observable<Putnal> {
    return this.sendHttpRequest<Putnal>("DELETE", `${this.baseUrl}/${id}`);
  }

  // API L4
  getSPDetailsData(id: number): Observable<PutnalDetail[]> {
    this.sptype = "putnalsdet";
    return this.sendHttpRequest<Putnal[]>(
      "GET",
      `${this.baseUrl}/${this.sptype}?pPutNalID=${id}`
    );
  }

  // API S6
  // pn_col: org_jed i temeljnica
  updatePutnalCol(pn_col: string, pPutnal: Putnal[]): Observable<boolean> {
    this.sptype = "putnalcolwrite";

    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);
    myHeaders = myHeaders.set("Content-Type", `application/json`);

    let body = JSON.stringify(pPutnal);

    return this.http
      .post<boolean>(`${this.baseUrl}/${this.sptype}?colname=${pn_col}`, body, {
        headers: myHeaders,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  // API S3
  savePutnalDetail(
    pn_id: number,
    pPutnalDetail: PutnalDetail[]
  ): Observable<PutnalDetail[]> {
    this.sptype = "putnaldetwrite";
    //let id = pPutnalDetail[0].pn_id;
    let id = pn_id;
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);
    myHeaders = myHeaders.set("Content-Type", `application/json`);

    let body = JSON.stringify(pPutnalDetail);

    return this.http
      .post<PutnalDetail[]>(
        this.baseUrl + "putnaldetwrite?pputnalid=" + id,
        body,
        { headers: myHeaders }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );

    //return this.sendSPRequest<Putnal[]>("POST",  `${this.baseUrl}${this.sptype}?pputnalid=${id}`, PutnalDetail);
    // return this.sendSPRequest<Putnal>("POST", this.url, Putnal);
  }

  // API ??
  updatePutnalDetail(PutnalDetail: PutnalDetail): Observable<PutnalDetail> {
    this.sptype = "putnaldetwrite";
    return this.sendHttpRequest<Putnal>(
      "PUT",
      `${this.baseUrl}/${this.sptype}/${PutnalDetail.id}`,
      PutnalDetail
    );
    // return this.sendSPRequest<Putnal>("PUT",
    //     `${this.url}/${Putnal.id}`, Putnal);
  }

  // API D2
  deletePutnalDetail(PutnalDetail: PutnalDetail): Observable<Putnal> {
    this.sptype = "putnalsdetdel";
    return this.sendHttpRequest<Putnal>(
      "POST",
      `${this.baseUrl}${this.sptype}?pPutNalID=${PutnalDetail.pn_id}&pID=${PutnalDetail.id}`
    );
  }

  //API:eS1
  saveESignSpNalog(esign: Esignature): Observable<Boolean> {
    this.sptype = "putnalsign";

    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);
    myHeaders = myHeaders.set("Content-Type", `application/json`);

    let body = JSON.stringify(esign);

    return this.http
      .post<Boolean>(this.baseUrl + `${this.sptype}`, body, {
        headers: myHeaders,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  //API:eS1
  saveESignSpNalogByCert(esign: EsignatureByCert): Observable<Boolean> {
    this.sptype = "putnalsignbycert";

    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);
    myHeaders = myHeaders.set("Content-Type", `application/json`);

    let body = JSON.stringify(esign);

    return this.http
      .post<Boolean>(this.baseUrl + `${this.sptype}`, body, {
        headers: myHeaders,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  //API:eD1
  delESignSpNalog(esign: Esignature): Observable<Boolean> {
    this.sptype = "putnalunsign";

    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);
    myHeaders = myHeaders.set("Content-Type", `application/json`);

    let body = JSON.stringify(esign);

    return this.http
      .post<Boolean>(this.baseUrl + `${this.sptype}`, body, {
        headers: myHeaders,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  //API:eD1
  delESignSpNalogByCert(esign: EsignatureByCert): Observable<Boolean> {
    this.sptype = "putnalunsignbycert";

    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);
    myHeaders = myHeaders.set("Content-Type", `application/json`);

    let body = JSON.stringify(esign);

    return this.http
      .post<Boolean>(this.baseUrl + `${this.sptype}`, body, {
        headers: myHeaders,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  // API ??
  getSPData(): Observable<Putnal[]> {
    this.sptype = "putnals";
    return this.http.get<Putnal[]>(
      this.baseUrl + `${this.sptype}?pEmpID=-1`,
      this.getOptions()
    );
  }

  // API F3
  getPdfReportPutnal(id: number, code: string): Observable<string> {
    this.sptype = "getreportname";
    let _rptCode: string = code == "Nalog" ? "PTNL1" : "PTNL2";
    let _dataCode: string = code == "Nalog" ? "PTNL1" : "PTNL2";
    return this.http.get<string>(
      this.baseUrl +
        `${this.sptype}?pPutNalId=${id}&parReportCode=${_rptCode}&parDataCode=${_dataCode}`,
      this.getOptions()
    );
  }

  getPdfReportPutnalBla(id: number, code: string): Observable<string> {
    this.sptype = "getreportmod";
    return this.http.get<string>(
      this.baseUrl + `${this.sptype}?pPutNalId=${id}&pPutNalDoc=1&pMode=bla`,
      this.getOptions()
    );
  }

  getPdfReportMergePotvrda(id: string): Observable<Blob> {
    this.sptype = "getreportmerge";
    return this.http.get<Blob>(
      this.baseUrl +
        `${this.sptype}?pPutNalId=${id}&report=PTNL11&potpis=false&watermark=true`,
      this.getOptionsByContent("application/pdf")
    );
  }

  getPdfReportMerge(id: string): Observable<Blob> {
    this.sptype = "getreportmerge";
    return this.http.get<Blob>(
      `${this.baseUrl}${this.sptype}?pPutNalId=${id}`,
      this.getOptionsByContent("application/pdf")
    );
  }

  getPdfReportMergeRpt(id: string, rpt:string): Observable<Blob> {
    this.sptype = "getreportmerge";
    return this.http.get<Blob>(
      `${this.baseUrl}${this.sptype}?pPutNalId=${id}&report=${rpt}`,
      this.getOptionsByContent("application/pdf")
    );
  }

  getPdfReportEvidDnevnik(
    empID: number,
    MM: number,
    YYYY: number
  ): Observable<string> {
    this.sptype = "getreportname";
    let _rptCode: string = "EVDN1";
    let _dataCode: string = "EVDN1";
    return this.http.get<string>(
      this.baseUrl +
        `${this.sptype}?parReportCode=${_rptCode}&parDataCode=${_dataCode}&pEmpId=${empID}&pMM=${MM}&pYYYY=${YYYY}`,
      this.getOptions()
    );
  }

  getPdfReportEvidPlate(
    empID: number,
    MM: number,
    YYYY: number
  ): Observable<string> {
    this.sptype = "evidsuma";
    let _sifra: string = "EM" + empID;
    return this.http.get<string>(
      this.baseUrl + `${this.sptype}?sifra=${_sifra}&mm=${MM}&yyyy=${YYYY}`,
      this.getOptions()
    );
  }

  // API E1
  // HACK E1 ovdje lista uposlenike pot org roli
  getEmployees(): Observable<Employee[]> {
    this.sptype = "Employees";
    return this.sendHttpRequest<Employee[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?$select=FirstName,EmployeeID&$inlinecount=allpages&$top=1000
        &$filter=startswith(tolower(FirstName),'')&byorgrole=byorgpg`
    );
  }
  // API E1
  // HACK E1 ovdje lista uposlenike pot org roli
  getEmployeesExt(): Observable<Employee[]> {
    this.sptype = "Employees";
    return this.sendHttpRequest<Employee[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?$select=FirstName,EmployeeID&$inlinecount=allpages&$top=1000
        &$filter=startswith(tolower(FirstName),'')&byorgrole=byorgpg&ext=ext`
    );
  }
  getSPEmpData(id: number): Observable<Putnal[]> {
    this.sptype = "putnals";
    return this.http.get<Putnal[]>(
      this.baseUrl + `${this.sptype}?pEmpID=${id}`,
      this.getOptions()
    );
  }

  getPutnal(id: number): Observable<Putnal> {
    this.sptype = "putnalshead";
    return this.sendHttpRequest<Putnal>(
      "GET",
      `${this.baseUrl}${this.sptype}?pPutNalID=${id}`
    );
  }

  //API:P-L1
  getProtokol(orgjed: string, godina: number): Observable<Protokol[]> {
    this.sptype = "protokol";
    return this.http.get<Protokol[]>(
      this.baseUrl + `${this.sptype}?pOrgJed=${orgjed}&pGodina=${godina}`,
      this.getOptions()
    );
  }

  //API:P-L1
  getProtokolByYear(godina: number): Observable<Protokol[]> {
    this.sptype = "protokol";
    return this.http.get<Protokol[]>(
      this.baseUrl + `${this.sptype}?pGodina=${godina}`,
      this.getOptions()
    );
  }

  //API:P-L2
  getProtokolFind(orgjed: string): Observable<Protokol> {
    let godina: number = new Date().getFullYear();
    this.sptype = "protokolfind";

    //console.log("rest API P-L2:" + this.baseUrl + `${this.sptype}?pOrgJed=${orgjed}&pGodina=${godina}`);
    return this.http.get<Protokol>(
      this.baseUrl + `${this.sptype}?pOrgJed=${orgjed}&pGodina=${godina}`,
      this.getOptions()
    );
  }

  //API:P-S1
  updateProtokol(_protokol: Protokol): Observable<Protokol> {
    this.sptype = "protokolwrite";

    console.log("rest API:" + JSON.stringify(_protokol));
    return this.sendProtokolReq<Protokol>(
      "POST",
      `${this.baseUrl}/${this.sptype}`,
      _protokol
    );
  }

  //API:P-C1
  saveProtokol(_protokol: Protokol): Observable<Protokol> {
    this.sptype = "protokolins";

    console.log("rest ins API:" + JSON.stringify(_protokol));
    return this.sendProtokolReq<Protokol>(
      "POST",
      `${this.baseUrl}/${this.sptype}`,
      _protokol
    );
  }

  //API:P-D1
  deleteProtokol(_protokol: Protokol): Observable<boolean> {
    this.sptype = "protokoldel";

    console.log("rest del API:" + JSON.stringify(_protokol));
    return this.sendProtokolReq<boolean>(
      "POST",
      `${this.baseUrl}/${this.sptype}`,
      _protokol
    );
  }

  private sendProtokolReq<T>(
    verb: string,
    url: string,
    body?: Protokol
  ): Observable<T> {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", `Bearer ${this.auth_token}`);

    return this.http
      .request<T>(verb, url, {
        body: body,
        headers: myHeaders,
      })
      .pipe(
        catchError((error: Response) =>
          throwError(`Network Error: ${error.statusText} (${error.status})`)
        )
      );
  }

  // API L6i
  getEreport(pPutnalId: number): Observable<Putnal> {
    return this.http.get<Putnal>(
      this.baseUrl + "putnalsizv?pPutNalID=" + pPutnalId,
      this.getOptions()
    );
  }

  // API L8i
  getDetIzvPutnal(pPutnalId: number): Observable<PutnalDetail[]> {
    return this.http.get<PutnalDetail[]>(
      this.baseUrl + "putnalsizvdet?pPutNalID=" + pPutnalId,
      this.getOptions()
    );
    // rezultat DateTime od API-ja                  2021-10-06T08:30:00 - 2021-10-06T20:30:00
    // rezultat u PutnalIzvComponent (Console FF-a):
    //                                              2021-10-06T06:30:00.000Z - 2021-10-06T18:30:00.000Z
    // povećao za 30 min preko web forme:           2021-10-06T07:00:00.000Z - 2021-10-06T19:00:00.000Z
    // nakon povećanaj za još 30 min
    // Spasi izvještaj pokazuje:                    2021-10-06T11:30:00      - 2021-10-06T23:00:00.000Z
    // a POST daje:                                 2021-10-06T09:30:00      - 2021-10-06T21:00:00
  }

  // API L9i
  getIzvPutnalByList(
    _bylist: string,
    days: number,
    status: string,
    createdby: number
  ): Observable<Putnal[]> {
    switch (_bylist) {
      case "byorgpg": {
        return this.getIzvPutnalByOrgRole(_bylist, days, status, createdby);
        break;
      }
      default: {
        return throwError(`Invalid list type: ${_bylist}`);
        break;
      }
    }
  }

  // API L9i
  getIzvPutnalByOrgRole(
    list: string,
    days: number,
    status: string,
    createdby: number
  ): Observable<Putnal[]> {
    this.sptype = "putnalsizvdetbyorgrole";
    return this.http.get<Putnal[]>(
      this.baseUrl +
        `${this.sptype}?list=${list}&days=${days}&status=${status}&createdby=${createdby}`,
      this.getOptions()
    );
  }
  // API L9i
  getIzvPutnalByUpo(
    empid: number,
    days: number,
    status: string
  ): Observable<Putnal[]> {
    let list: string = "byupo";
    this.sptype = "putnalsizvdetbyorgrole";
    return this.http.get<Putnal[]>(
      this.baseUrl +
        `${this.sptype}?list=${list}&empid=${empid}&days=${days}&status=${status}&createdby=-1`,
      this.getOptions()
    );
  }

  // API S4i
  updateIzvPutnal(Putnal: Putnal): Observable<Putnal> {
    return this.http.post<Putnal>(
      this.baseUrl + "putnalwrite?action=izvjestaj",
      Putnal,
      this.getOptions()
    );
  }

  // API S5i
  updateDetIzvPutnal(
    pPutnalId: number,
    putnalsdet: PutnalDetail[]
  ): Observable<PutnalDetail[]> {
    //console.log("API-updateDetIzvPutnal:" + this.baseUrl  + "putnalizvdetwrite?pPutNalID="+pPutnalId);
    return this.http.post<PutnalDetail[]>(
      this.baseUrl + "putnalizvdetwrite?pPutNalID=" + pPutnalId,
      putnalsdet,
      this.getOptions()
    );
  }

  // API S1
  changeStatusPutnal(Putnal: Putnal): Observable<Putnal> {
    return this.http.post<Putnal>(
      this.baseUrl + "putnalwrite?action=status",
      Putnal,
      this.getOptions()
    );
  }

  // API A-l1
  //
  getAktivnost(): Observable<Aktivnost[]> {
    this.sptype = "aktivnost";
    return this.sendHttpRequest<Aktivnost[]>(
      "GET",
      `${this.baseUrl}${this.sptype}`
    );
  }
  // API A-C1
  //
  saveAktivnost(Aktivnost: any): Observable<Aktivnost> {
    this.sptype = "aktivnostins";
    return this.http.post<Aktivnost>(
      `${this.baseUrl}${this.sptype}`,
      Aktivnost,
      this.getOptions()
    );
  }
  // API A-S1
  //
  updateAktivnost(Aktivnost: any): Observable<boolean> {
    this.sptype = "aktivnostwrite";
    return this.http.post<boolean>(
      `${this.baseUrl}${this.sptype}`,
      Aktivnost,
      this.getOptions()
    );
  }

  // API US-L1
  // HACK status=[A,S,P,K,””]
  getEmployeesRec(_status: string): Observable<EmployeeRec[]> {
    this.sptype = "employee";
    return this.sendHttpRequest<EmployeeRec[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?status=${_status}`
    );
  }
  // API US-L2
  getEmployeeRec(_empId: number): Observable<EmployeeRec> {
    this.sptype = "employee";
    return this.sendHttpRequest<EmployeeRec>(
      "GET",
      `${this.baseUrl}${this.sptype}?id=${_empId}&status=X`
    );
  }

  // API US-L3 lista prema org.roli logovanog usera
  getEmployeesRecByRole(_org: string): Observable<EmployeeRec[]> {
    this.sptype = "employeeslist";
    return this.sendHttpReq<EmployeeRec[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?list=${_org}&vrsta=1`
    );
  }

  //API:aUL1 lista uposlenika sa podacima o pristupu portalu
  getEmployeesRecBySifra(
    _org: string,
    _sifra: string
  ): Observable<EmployeeRec[]> {
    this.sptype = "employeeslist";

    return this.sendHttpReq<EmployeeRec[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?list=${_org}&sifra=${_sifra}`
    );
  }

  //API:aUL1 lista uposlenika sa podacima o pristupu portalu
  getEmployeesRecBySifraVrsta(
    _org: string,
    _sifra: string,
    _vrsta: number
  ): Observable<EmployeeRec[]> {
    this.sptype = "employeeslist";

    return this.sendHttpReq<EmployeeRec[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?list=${_org}&sifra=${_sifra}&vrsta=${_vrsta}`
    );
  }

  //API:aUL1 lista uposlenika sa podacima o pristupu portalu
  getEmployeesRecByVar(
    _byvar: string,
    _org: string,
    _sifra: string,
    _vrsta: number
  ): Observable<EmployeeRec[]> {
    this.sptype = "employeeslistvar";

    return this.sendHttpReq<EmployeeRec[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?pvar=${_byvar}&list=${_org}&sifra=${_sifra}&vrsta=${_vrsta}`
    );
  }

  // API US-C1
  //
  saveEmployeesRec(EmployeeRec: any): Observable<EmployeeRec> {
    this.sptype = "employeeins";
    return this.http.post<EmployeeRec>(
      `${this.baseUrl}${this.sptype}`,
      EmployeeRec,
      this.getOptions()
    );
  }
  // API US-S1
  //
  updateEmployeesRec(EmployeeRec: any): Observable<boolean> {
    this.sptype = "employeewrite";
    return this.http.post<boolean>(
      `${this.baseUrl}${this.sptype}`,
      EmployeeRec,
      this.getOptions()
    );
  }

  // API US-S1    set B
  //
  updateEmployeesRecB(EmployeeRec: any): Observable<boolean> {
    this.sptype = "employeewrite";
    return this.http.post<boolean>(
      `${this.baseUrl}${this.sptype}?set=B`,
      EmployeeRec,
      this.getOptions()
    );
  }

  // API US-S1    set C
  //
  updateEmployeesRecC(EmployeeRec: any): Observable<boolean> {
    this.sptype = "employeewrite";
    return this.http.post<boolean>(
      `${this.baseUrl}${this.sptype}?set=C&field=work_station`,
      EmployeeRec,
      this.getOptions()
    );
  }

  // API US-S1    set C
  //
  updateEmployeesRecC1(EmployeeRec: any, fieldName: string): Observable<boolean> {
    this.sptype = "employeewrite";
    return this.http.post<boolean>(
      `${this.baseUrl}${this.sptype}?set=C&field=${fieldName}`,
      EmployeeRec,
      this.getOptions()
    );
  }

  // API Op-l1
  //
  getOpcina(): Observable<Opcina[]> {
    this.sptype = "opcina";
    return this.sendHttpRequest<Opcina[]>(
      "GET",
      `${this.baseUrl}${this.sptype}`
    );
  }

  // API ol1
  //
  getOrganizacija(_list: string): Observable<OrgJed[]> {
    this.sptype = "getorganizacijalist";
    return this.sendHttpReq<OrgJed[]>(
      "GET",
      `${this.baseUrl}${this.sptype}??list=${_list}&numeric=true`
    );
    //return this.sendHttpRequest<OrgJed[]>("GET", `${this.baseUrl}${this.sptype}?list=${_list}`);
  }

  // API Si-l3
  //
  getSfrEvidPris(): Observable<EvidSifra[]> {
    this.sptype = "sfrevidpris";
    //console.log("rest: " + `${this.baseUrl}${this.sptype}?vrsta=dnevnik`);
    return this.sendHttpRequest<EvidSifra[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?vrsta=dnevnik`
    );
  }

  // API ed-l1
  //
  getEvidDnevnik(
    _empID: number,
    _MM: number,
    _YYYY: number
  ): Observable<EvidDnevnik[]> {
    this.sptype = "eviddnevnik";
    return this.sendHttpRequest<EvidDnevnik[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?vrsta=list&EmployeeID=${_empID}&mm=${_MM}&yyyy=${_YYYY}&prepare=false`
    );
  }

  // API ed-l1  Insert
  //
  insEvidDnevnik(
    _empID: number,
    _MM: number,
    _YYYY: number
  ): Observable<EvidDnevnik[]> {
    this.sptype = "eviddnevnik";
    return this.sendHttpRequest<EvidDnevnik[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?vrsta=ins&EmployeeID=${_empID}&mm=${_MM}&yyyy=${_YYYY}`
    );
  }

  // API ed-S1
  //
  updEvidDnevnik(
    _evidDnevnik: EvidDnevnik[],
    _superlock?: boolean
  ): Observable<EvidDnevnik[]> {
    this.sptype =
      _superlock == true
        ? "eviddnevnikwrite?pSuperLock=" + _superlock
        : "eviddnevnikwrite";
    //return this.sendHttpRequest<EvidDnevnik[]>("GET", `${this.baseUrl}${this.sptype}?vrsta=ins&EmployeeID=${_empID}&mm=${_MM}&yyyy=${_YYYY}`);
    console.log("rest: " + this.sptype);
    return this.http.post<PutnalDetail[]>(
      `${this.baseUrl}${this.sptype}`,
      _evidDnevnik,
      this.getOptions()
    );
  }

  // API ed-lk ed-Ulk
  //
  getEvidDnevnikSend(
    _empID: number,
    _MM: number,
    _YYYY: number,
    _value: boolean
  ): Observable<EvidDnevnik[]> {
    this.sptype = "eviddnevnik";
    let _valStr: string = _value ? "send" : "unsend";
    return this.sendHttpRequest<EvidDnevnik[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?vrsta=${_valStr}&EmployeeID=${_empID}&mm=${_MM}&yyyy=${_YYYY}`
    );
  }

  // API go-L1
  //
  getEvidGodOdm(_empID: number, _YYYY: number): Observable<EvidGodOdm> {
    this.sptype = "evidgododm";
    return this.sendHttpRequest<EvidGodOdm>(
      "GET",
      `${this.baseUrl}${this.sptype}?vrsta=ins&EmployeeID=${_empID}&yyyy=${_YYYY}`
    );
  }

  // API ed-L2
  //
  getEvidDnStatus(_MM: number, _YYYY: number): Observable<EvidDnStatus[]> {
    this.sptype = "eviddnstatusbyorgrole";
    return this.sendHttpRequest<EvidDnStatus[]>(
      "GET",
      `${this.baseUrl}${this.sptype}?list=byorgpg&mm=${_MM}&yyyy=${_YYYY}`
    );
  }

  // API ed-S2
  //
  updEvidDnStatus(_EvidDnStatus: EvidDnStatus[]): Observable<EvidDnStatus[]> {
    this.sptype = "eviddnstatuswrite";
    return this.http.post<EvidDnStatus[]>(
      `${this.baseUrl}${this.sptype}`,
      _EvidDnStatus,
      this.getOptions()
    );
  }

  // API ec-L1
  //
  getEcertStatus(_ECertificate: ECertificate): Observable<ECertificate> {
    this.sptype = "ecertlist";
    return this.http.post<ECertificate>(
      `${this.baseUrl}${this.sptype}`,
      _ECertificate,
      this.getOptions()
    );
  }

  // API ec-L2
  //
  getEcertVerify(_ECertificate: ECertificate): Observable<boolean> {
    this.sptype = "ecertverify";
    return this.http.post<boolean>(
      `${this.baseUrl}${this.sptype}`,
      _ECertificate,
      this.getOptions()
    );
  }

  // API ec-D1
  //
  delEcertImg(_empID: number): Observable<boolean> {
    this.sptype = "ecertimgdel";
    return this.sendHttpReq<boolean>(
      "GET",
      `${this.baseUrl}${this.sptype}?pEmployeeID=${_empID}`
    );
  }

  // API ec-L2
  //
  getEcertImg(_empID: number): Observable<Blob> {
    this.sptype = "ecertimgget";
    return this.http.get<Blob>(
      this.baseUrl + `${this.sptype}?pEmployeeID=${_empID}`,
      this.getOptionsBlob()
    );
  }

  // API ec-C2
  //
  insEcert(_ECertificate: ECertificate): Observable<ECertificate> {
    this.sptype = "ecertins";
    return this.http.post<ECertificate>(
      `${this.baseUrl}${this.sptype}`,
      _ECertificate,
      this.getOptions()
    );
  }

  // API ****
  //
  getPdfFile(_fileName: string): Observable<Blob> {
    this.sptype = "getreport";
    return this.http.get<Blob>(
      `${this.baseUrl}${this.sptype}?pFileName=${_fileName}`,
      this.getOptionsByContent("application/pdf")
    );
  }

  getPdfFileRemove(_fileName: string, _pageRemove: string): Observable<Blob> {
    this.sptype = "getreport";
    return this.http.get<Blob>(
      `${this.baseUrl}${this.sptype}?pFileName=${_fileName}&pPageRemove=${_pageRemove}`,
      this.getOptionsByContent("application/pdf")
    );
  }

  getPdfCrPotpis(
    _startDt: string,
    _endDt: string,
    _typeDoc: number,
    _empID: number
  ): Observable<Blob> {
    this.sptype = "getreport1";
    let _rCode = _typeDoc == 1 ? "PTNL3" : "PTNL4";
    return this.http.get<Blob>(
      `${this.baseUrl}${this.sptype}?RCode=${_rCode}&DCode=PTNL3&FName=PTNL4_obr.pdf&p1=${_empID}&p2='${_startDt}'&p3='${_endDt}'&p4=${_typeDoc}`,
      this.getOptionsByContent("application/pdf")
    );
  }

  getPdfPnLista(
    _startDt: string,
    _endDt: string,
    _typeDoc: string
  ): Observable<Blob> {
    this.sptype = "getreport1";
    let _rCode = "PTNL6";
    return this.http.get<Blob>(
      `${this.baseUrl}${this.sptype}?RCode=${_rCode}&DCode=PTNL6&FName=PTNL6_obr.pdf&p1='${_startDt}'&p2='${_endDt}'&p3='${_typeDoc}'`,
      this.getOptionsByContent("application/pdf")
    );
  }

  // API ****
  // PRILOZI...
  getPrilog(_putNalID: number): Observable<PutnalPrilog[]> {
    this.sptype = "putnalprilog";
    return this.http.get<PutnalPrilog[]>(
      this.baseUrl + `${this.sptype}?pPutNalID=${_putNalID}`,
      this.getOptions()
    );
  }

  // API ADD, UPDATE, DELETE PRILOZI...
  updPutnalPrilog(
    _putNalID: number,
    _putnalPrilog: PutnalPrilog[]
  ): Observable<PutnalPrilog[]> {
    this.sptype = "putnalprilogwrite";
    console.log("prilog batchSave: " + JSON.stringify(_putnalPrilog));
    return this.http.post<PutnalPrilog[]>(
      this.baseUrl + `${this.sptype}?pPutNalID=${_putNalID}`,
      _putnalPrilog,
      this.getOptions()
    );
  }

  updPutnalPrilogObr(
    _putNalID: number,
    _ID: number,
    _putNalObrID: number
  ): Observable<PutnalPrilog[]> {
    this.sptype = "putnalprilogobrwrite";
    return this.http.get<PutnalPrilog[]>(
      this.baseUrl +
        `${this.sptype}?pPutNalID=${_putNalID}&pID=${_ID}&pPutNalObrID=${_putNalObrID}`,
      this.getOptions()
    );
  }

  // API REST Person
  //
  getPerson(_sifra: number): Observable<Person> {
    this.sptype = "person";
    return this.sendHttpRequest<Person>(
      "GET",
      `${this.baseUrl}${this.sptype}?psifra=${_sifra}`
    );
  }
  //
  getPersonAll(): Observable<Person[]> {
    this.sptype = "person";
    return this.sendHttpRequest<Person[]>(
      "GET",
      `${this.baseUrl}${this.sptype}`
    );
  }
  // API A-C1
  //
  insPerson(Person: Person): Observable<Person> {
    this.sptype = "person";
    return this.http.post<Person>(
      `${this.baseUrl}${this.sptype}`,
      Person,
      this.getOptions()
    );
  }
  // API A-S1
  //
  updPerson(Person: Person): Observable<Person> {
    this.sptype = "person";
    return this.http.put<Person>(
      `${this.baseUrl}${this.sptype}?psifra=${Person.Sifra}`,
      Person,
      this.getOptions()
    );
  }
  //
  delPerson(_sifra: number): Observable<Person> {
    this.sptype = "person";
    return this.http.delete<Person>(
      `${this.baseUrl}${this.sptype}?psifra=${_sifra}`,
      this.getOptions()
    );
  }
  //
  getPersonUnionAll(): Observable<PersonUnion[]> {
    this.sptype = "personunion";
    return this.sendHttpRequest<PersonUnion[]>(
      "GET",
      `${this.baseUrl}${this.sptype}`
    );
  }

  //
  insProtokol(Protokol: any): Observable<Protokol> {
    this.sptype = "protokol";
    return this.http.post<Protokol>(
      `${this.baseUrl}${this.sptype}`,
      Protokol,
      this.getOptions()
    );
  }
  // API A-S1
  //
  updProtokol(Protokol: { Id: any; }): Observable<Protokol> {
    this.sptype = "protokol";
    return this.http.put<Protokol>(
      `${this.baseUrl}${this.sptype}?pId=${Protokol.Id}`,
      Protokol,
      this.getOptions()
    );
  }

  // API Insert u knjigu protokola pn ...
  //
  insProtokolEvid(_pId: number, ProtokolEvid: any): Observable<ProtokolEvid> {
    this.sptype = "protokolevid";
    return this.http.post<ProtokolEvid>(
      `${this.baseUrl}${this.sptype}?pid=${_pId}`,
      ProtokolEvid,
      this.getOptions()
    );
  }

  // API Insert u knjigu protokola pn ...
  //
  getProtokolEmp(): Observable<Protokol[]> {
    this.sptype = "protokolemp";
    return this.http.get<Protokol[]>(
      this.baseUrl + `${this.sptype}`,
      this.getOptions()
    );
  }
  //
  getProtokolAll(): Observable<Protokol[]> {
    this.sptype = "protokol";
    return this.sendHttpRequest<Protokol[]>(
      "GET",
      `${this.baseUrl}${this.sptype}`
    );
  }
  //
  getProtokolPravaAll(): Observable<ProtokolPrava[]> {
    this.sptype = "pn_protokolprava";
    return this.sendHttpRequest<ProtokolPrava[]>(
      "GET",
      `${this.baseUrl}${this.sptype}`
    );
  }

  //
  insProtokolPrava(ProtokolPrava: any): Observable<ProtokolPrava> {
    this.sptype = "pn_protokolprava";
    return this.http.post<ProtokolPrava>(
      `${this.baseUrl}${this.sptype}`,
      ProtokolPrava,
      this.getOptions()
    );
  }

  delProtokolPrava(ProtokolPrava: { Id: any; }): Observable<ProtokolPrava> {
    this.sptype = "pn_protokolprava";
    return this.http.delete<ProtokolPrava>(
      `${this.baseUrl}${this.sptype}?pId=${ProtokolPrava.Id}`,
      this.getOptions()
    );
  }

    //
    getProtokolTable(_pGod: any, _pProtokol: any): Observable<any[]> {
        this.sptype = "getreportjson";
        return this.sendHttpRequest<Protokol[]>(
          "GET",
          `${this.baseUrl}${this.sptype}?parDataCode=PTNL5&godina=${_pGod}&protokol=${_pProtokol}`
        );
      }

  // API REST PutnalStatus2
  //
  getPnStatus(_pId: number): Observable<PutnalStatus2> {
    this.sptype = "pn_status";
    return this.sendHttpRequest<PutnalStatus2>(
      "GET",
      `${this.baseUrl}${this.sptype}?pId=${_pId}`
    );
  }
  //
  getPnStatusAll(): Observable<PutnalStatus2[]> {
    this.sptype = "pn_status";
    return this.sendHttpRequest<PutnalStatus2[]>(
      "GET",
      `${this.baseUrl}${this.sptype}`
    );
  }

  getAPIversion(): Observable<APIversion> {
    this.sptype = "getAPIver";
    return this.http.get<APIversion>(`${this.baseUrl}${this.sptype}`);
  }
}
