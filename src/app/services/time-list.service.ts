import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from "rxjs";

import { RestDataSource } from "../shared/rest.datasource";
import { UserSessionService } from '../services/user-session.service';


@Injectable({
  providedIn: 'root'
})
export class TimeListService {

  constructor(
    public restDataSource: RestDataSource,
    public usersession: UserSessionService) {

  }

 public timeArray(_start:string, _end:string, _interval:number){
    let start = _start.split(":");
    let end = _end.split(":");

    let _istart: number;
    let _iend: number;
    _istart = parseInt(start[0]) * 60 + parseInt(start[1]);
    _iend = parseInt(end[0]) * 60 + parseInt(end[1]);

    var result = [];

    for ( let time = _istart; time <= _iend; time+= _interval){
        result.push( this.timeString(time));
    }
  
    result.push("23:59");
    
    return result;
}

private timeString(time:number):string{
    let hours = Math.floor(time / 60);
    let minutes = time % 60;

    let _hours: string = hours.toString();
    let _minutes: string = minutes.toString();

    if (hours < 10) _hours = "0" + _hours; //optional
    if (minutes < 10) _minutes = "0" + _minutes;

    return _hours + ":" + _minutes;
}  

}
