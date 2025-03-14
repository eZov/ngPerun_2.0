import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { APIversion } from '../../model/api-version.model';
import { RestDataSource } from '../../shared/rest.datasource';

@Injectable({
  providedIn: 'root'
})
export class APIversionService {

private clientInfo: APIversion;
private apiInfo: APIversion;

public infoVersion = new Subject<string>();

private  devText: string = "";

  constructor(
    private dataSource: RestDataSource
  ) {

    this.clientInfo = new APIversion();
    this.clientInfo.version = "0.9.25.03.09";
    this.clientInfo.footer = " | Perun - ver ";
    this.clientInfo.mainText = " | Perun | ver ";

    this.apiInfo = new APIversion();

    this.dataSource.getAPIversion().subscribe(
      (data: APIversion )=> {

        this.apiInfo.version = data.version;
        this.apiInfo.footer = data.footer;

        this.initDev();
        let _info = this.devText +  this.clientInfo.footer + this.clientInfo.version + " ( api ver: " + this.apiInfo.version + " )";
        this.infoVersion.next(_info);

        console.log("apiVer 1:", data);
      }, error => {
        let _info = "API server trenutno nije dostupan!";
        this.infoVersion.next(_info);              
        console.log(error);     
      }      
    );



   }

  initDev() {

    const url = window.location.href;

    let _devConsole: boolean = false;

    if (url.includes("localhost")) {
      this.devText = "LOCAL DEVELOPMENT ... ";
      _devConsole = true;
    }

    if (url.includes("dev")) {
      this.devText = "TESTNI PORTAL ... ";
      _devConsole = true;
    }

    // Disable console.log
    if (_devConsole != true) {
      console.log = function () { };
    }

  }
}
