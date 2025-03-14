import { Injectable } from "@angular/core";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: "root",
})
export class UserSessionService {

  public email: string = "";
  public role: string = "";
  public subrole: string = "";
  public empId: number = -1;
  public workstation: number = -1;

  public idleTime: number = 300;

  public loggedIn: boolean = false;
  public menuData!: { [key: string]: Object }[];

  public unosNaloga: boolean = false;

  //HACK: apiList = empId samo svoji nalozi; -1 svi nalozi prema org roli; 0 prazna lista
  public apiList: number = 0;

  public apiPnCreatedBy!: number;
  public apiPnDoc!: number;
  public apiPnVrsta!: string;

  public apiDays: number;
  public apiStatus: string;



  public selectedSpNalogStatus = '';

  public nalogsPerPage = 15;
  public selectedPage = 0;

  public odobSpNalog: number = 0;

  //HACK: Ovi parametri bi trebali biti univerzalni za bilo koju grid tabelu usera
  //      Key se uzima prema nzivu komponente: this.usersession.gridSelectedRowIndex["evid_kontrola"]
  //      Ukoliko ima više gridova, index formirati dodavanjem -1, -2 itd: ["evid_kontrola-1"], ["evid_kontrola-2"]
  public gridSelectedRowIndex: { [key: string]: number } = {};
  public gridCurrentPage: { [key: string]: number } = {};
  public gridPageSize: { [key: string]: number } = {};
  public gridSearch: { [key: string]: string } = {};

  public firstDate = new Date();

  /* url status  */
  public url!: string;
  public urlPrev!: string;

  constructor(

  ) {
    this.apiDays = 30;
    this.apiStatus = "priprema,akontacija";

    /* Do 5.-og u mjesecu prikazuje prethodni mjesec */
    this.firstDate.setDate(this.firstDate.getDate() - 6);

    console.log("UserSession constructor 454: " + this.apiDays);
  }

  changeSpNalogStatus(newStatus: string) {
    this.selectedSpNalogStatus = newStatus;
  }

  changeSpNalogsPerPage(newNalogsPerPage: number) {
    this.nalogsPerPage = newNalogsPerPage;
  }

  changeSpNalogsSelPage(newNalogsSelPage: number) {
    this.selectedPage = newNalogsSelPage;
  }

  logout() {
    // this.auth.logout();
    this.role = '';
    this.loggedIn = false;
  }

  navigateUrl(url: string) {
    this.urlPrev = this.url;
    this.url = url;
    console.log(
      "UserSession navigateUrl url: " + this.url + "  url-prev: " + this.urlPrev
    );
  }
}
