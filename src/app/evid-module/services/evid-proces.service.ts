import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { catchError, map, Observable, of, Subject, switchMap } from "rxjs";

import { UserSessionService } from '../../core-services/user-session.service';
import { EvidDnevnik } from '../../model/evid-dnevnik.model';
import { EvidCalendar } from '../../model/evid-calendar.model';
import { EvidCalendarWeek } from '../../model/evid-calendar-week.model';
import { EvidSifra } from '../../model/evid-sifra.model';
import { EvidGodOdm } from '../../model/evid-gododm.model';
import { AppRole } from "../../app-roles";
import { HttpCoreService } from "../../core-services/http-core.service";



@Injectable({
    providedIn: 'root'
})
export class EvidProcesService {

    // PROCES EVIDENCIJA - flagovi
    public _evdPodnio!: boolean;
    public _evdLockedExt: boolean = true;
    //public _evdStop: boolean = true;
    public _evdKontrolisao: boolean = false;
    public _evdKontrolaUToku: boolean = false;

    public _evidPodnesen: boolean = false;
    // /////////////////////////////////////////////////////////////////////////////////////

    // Buttons
    public _sendButtonOn!: boolean;   //HACK: eCalendarService.sendButtOn odredjuje da li je button Podnesi (sendButtOn=TRUE) ili Opozovi (sendButtOn=FALSE)
    public _saveButtonOn!: boolean;
    public _disabledButton!: boolean;
    // /////////////////////////////////////////////////////////////////////////////////////////

    // Buttons NOVI FLAGOVI
    private _sndBtnDis: Subject<{disabled: boolean, title: string}> = new Subject<{disabled: boolean, title: string}>();
    public sndBtnDis$ = this._sndBtnDis.asObservable();
    // /////////////////////////////////////////////////////////////////////////////////////////


    constructor(
        public usersession: UserSessionService,
        private httpCoreService: HttpCoreService
    ) { }

    public setFlags(_evidDnevnikData: EvidDnevnik[]) {
        // console.log(`evid-proces.service: setFlags() _evidDnevnikData: ${JSON.stringify(_evidDnevnikData)}`);
        let _el: EvidDnevnik = _evidDnevnikData.find(el => el.locked_ext === true || el.locked_ext === false) || {} as EvidDnevnik;
        //console.log(`evid-calendar.service 1a: ${JSON.stringify(_el)} `);
        //console.log(`evid-calendar.service 1b: ${JSON.stringify(_el.locked_ext)} `);

        this._evdKontrolisao = ((_el.evd_kontrolisao || 0) > 0) ? true : false;
        this._evdLockedExt = _el.locked_ext || false;
        //this._evdStop = (_el.evd_kontrolisao || 0) > 0 ? true : false; //HACK: zašto se referiše na evd_kontrolisao?
        this._evdPodnio = (_el.evd_podnio || 0) > 0 ? true : false;

        this._evdKontrolaUToku = (_el.evd_kontrolisao == -1) ? true : false;

        console.log(`evid-calendar.service 1c: ${JSON.stringify(this._evdLockedExt)} `);

        this.sendDisableSet();
    }

    public sendDisable() {

        switch (this.usersession.user.role) {
            case AppRole.Uposlenik: {


                switch (this._sendButtonOn) {
                    case true: {
                        this._disabledButton = this._evdLockedExt || this._evdPodnio;
                        //this._sndBtnDis.next(this._disabledButton);
                        break;
                    }

                    case false: {
                        this._disabledButton = this._evdLockedExt || !this._evdPodnio;
                        //this._sndBtnDis.next(this._disabledButton);
                        break;
                    }
                }

                break;
            }
            case AppRole.Sekretarica: {

                switch (this._sendButtonOn) {
                    case true: {
                        this._disabledButton = this._evdLockedExt || this._evdPodnio || (this._evdKontrolisao === false);
                        //this._sndBtnDis.next(this._disabledButton);
                        break;
                    }

                    case false: {
                        this._disabledButton = this._evdLockedExt || !this._evdPodnio || (this._evdKontrolisao === false);
                        //this._sndBtnDis.next(this._disabledButton);
                        break;
                    }
                }
                break;
            }
            default: {
                //statements; 
                break;
            }
        }

        this._saveButtonOn = false;

    }

    public sendDisableSet() {

        //this.setFlags(this._evidDnevnikData);

        console.log(`evid-calendar.service : ${this._evdLockedExt} - ${this._evdPodnio}`);

        switch (this.usersession.user.role) {
            case AppRole.Uposlenik: {
                this._sendButtonOn = !(this._evdLockedExt || this._evdPodnio);

                let _value = {disabled: false, title: 'Podnesi' };
                _value = this._evdPodnio === false ? _value : {disabled: true, title: 'Opozovi' };
                _value.disabled = this._evdLockedExt || this._evdKontrolisao;

                this._sndBtnDis.next(_value);
            }
                break;
            case AppRole.Sekretarica: {
                //HACK: mora biti TRUE da bi PODNESI bio omogućen
                this._sendButtonOn = !(this._evdLockedExt || this._evdPodnio) && (this._evdKontrolisao === true);

                let _value = {disabled: false, title: 'Podnesi' };
                _value = this._evdPodnio === false ? _value : {disabled: true, title: 'Opozovi' };
                _value.disabled = this._evdLockedExt;

                this._sndBtnDis.next(_value);
            }
                break;
        }

        this._sendButtonOn = !(this._evdLockedExt || this._evdPodnio);
        this._saveButtonOn = this._sendButtonOn === true ? true : false;

    }

}
