import { Injectable } from "@angular/core";
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { User } from "../core-module/user.model";
import { AppRole } from "../app-roles";

@Injectable({
  providedIn: "root",
})
export class UserSessionService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  private userSubj = new BehaviorSubject<User>(new User());

  public user: User = new User();


  public empId: number = -1;
  public workstation: number = -1;

  public idleTime: number = 300;


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
  //      Key se uzima prema nzivu komponente: this.gridSelectedRowIndex["evid_kontrola"]
  //      Ukoliko ima više gridova, index formirati dodavanjem -1, -2 itd: ["evid_kontrola-1"], ["evid_kontrola-2"]
  public gridSelectedRowIndex: { [key: string]: number } = {};
  public gridCurrentPage: { [key: string]: number } = {};
  public gridPageSize: { [key: string]: number } = {};
  public gridSearch: { [key: string]: string } = {};

  public firstDate = new Date();

  /* url status  */
  public url!: string;
  public urlPrev!: string;

  constructor() {
    this.apiDays = 30;
    this.apiStatus = "priprema,akontacija";

    /* Do 5.-og u mjesecu prikazuje prethodni mjesec */
    this.firstDate.setDate(this.firstDate.getDate() - 6);

    console.log("UserSession constructor 454: " + this.apiDays);
  }

  setLoggedIn(userLoggedIn: boolean) {
    this.loggedIn.next(userLoggedIn);
    console.log("menubar user-session-service 1" + JSON.stringify(this.user));
    //this.userSubj.next(this.user);
  }

  getLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  setUser(user: User) {
    this.user = user;
    this.userSubj.next(user);
  }

  getUser(): Observable<User> {
    return this.userSubj.asObservable();
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


  navigateUrl(url: string) {
    this.urlPrev = this.url;
    this.url = url;
    console.log(
      "UserSession navigateUrl url: " + this.url + "  url-prev: " + this.urlPrev
    );
  }

  changeSetPerRole() {

    switch (this.user.role) {
      case AppRole.Blagajna:
      case AppRole.Uposlenik: {
        this.unosNaloga = false;
        this.apiList = -1;
        break;
      }
      case AppRole.Likvidatura:
      case AppRole.Rukovodilac: {
        this.unosNaloga = true;
        this.apiList = -1;
        break;
      }
      case AppRole.Sekretarica:
      case AppRole.Producent: {
        this.unosNaloga = true;
        this.apiList = this.empId;
        break;
      }
      case AppRole.Direkcija: {
        this.unosNaloga = true;
        this.apiList = -1;
        break;
      }
      case AppRole.Uprava: {
        this.unosNaloga = true;
        this.apiList = -1;
        break;
      }
      default: {
        //statements; 
        break;
      }
    }

    this.nalogsPerPage = 15;
  }
}
