import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, Subject } from "rxjs";
//import { shareReplay, catchError, map } from 'rxjs/operators';

import { RestDataSource } from "../shared/rest.datasource";
import { UserSessionService } from '../core-module/services/user-session.service';
import { EvidDnevnik } from '../model/evid-dnevnik.model';
import { EvidCalendar } from '../model/evid-calendar.model';
import { EvidCalendarWeek } from '../model/evid-calendar-week.model';
import { EvidSifra } from '../model/evid-sifra.model';
import { EvidGodOdm } from '../model/evid-gododm.model';
// import { forEach } from '@angular/router/src/utils/collection';


@Injectable({
    providedIn: 'root'
})
export class EvidCalendarService {

    sfrevidprisData: EvidSifra[] = new Array<EvidSifra>();

    // HACK: ulazni datasource koji se prenosi u evidCalendarData
    private _evidDnevnikData: EvidDnevnik[] = new Array<EvidDnevnik>();

    // HACK: koristi kalendar  
    public evidCalendarData: EvidCalendar[] = new Array<EvidCalendar>();
    public evidCalendarWeekData: EvidCalendarWeek[] = new Array<EvidCalendarWeek>();

    public SumSati = 0;
    private SumSatiObs = new Subject<number>();

    public _selEvid!: EvidCalendar;
    public chkSuperLock: boolean = false;

    public godOdm!: EvidGodOdm;
    private godOdmObs = new Subject<EvidGodOdm>();

    public _evdLockedExt: boolean = true;
    public _evdStop: boolean = true;
    public _sendButtonOn!: boolean;   //HACK: eCalendarService.sendButtOn odredjuje da li je button Podnesi (sendButtOn=TRUE) ili Opozovi (sendButtOn=FALSE)
    public _saveButtonOn!: boolean;
    public _disabledButton!: boolean;
    public _podnio!: boolean;
    private _el!: EvidDnevnik;

    private _goYCurrIsk: number = 0;
    private _goYPrevIsk: number = 0;

    constructor(
        public restDataSource: RestDataSource,
        public usersession: UserSessionService) {

        // this.chkSuperLock = this.usersession.role === "sekretarica"? true : false;
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {

        let _dt = this.usersession.firstDate;
        //_dt.setDate(_dt.getDate() - 6);

        let _empid = route.params["empid"] != undefined ? route.params["empid"] : this.usersession.user.empId;
        let _MM: number = route.params["mm"] != undefined ? route.params["mm"] : _dt.getMonth() + 1;
        let _YYYY: number = route.params["yyyy"] != undefined ? route.params["yyyy"] : _dt.getFullYear();

        //console.log("EvidDnevnikService-a: " + JSON.stringify(route.params));
        //console.log("EvidDnevnikService-b: " + _empid + "-" + _MM + "-" + _YYYY);

        if (route.params['length'] > 0) {
            _empid = route.params["empid"];
            _MM = route.params["mm"];
            _YYYY = route.params["yyyy"];
        }
        this.evidCalendarWeekData = new Array<EvidCalendarWeek>();
        this.chkSuperLock = this.usersession.user.role === "sekretarica" ? true : false;

        //console.log("EvidDnevnikService-c: " + JSON.stringify(this.evidCalendarWeekData));

        return this.restDataSource.getEvidDnevnik(_empid, _MM, _YYYY);

    }

    get evidDnevnikData(): EvidDnevnik[] {
        return this._evidDnevnikData;
    }

    set evidDnevnikData(value: EvidDnevnik[]) {
        this._evidDnevnikData = value;
        this._el = this._evidDnevnikData.find(el => el.locked_ext === true || el.locked_ext === false) || {} as EvidDnevnik;
        let _dummyDataGrid: string = JSON.stringify(this.evidDnevnikData);
        this.convertToDay(_dummyDataGrid);
        this.processCalendarData();
    }


    get isPodnio(): boolean {

        //let _el: EvidDnevnik = this._evidDnevnikData.find(el => el.locked_ext === true || el.locked_ext === false);
        let _podnio: boolean = false;
        if (this._el.evd_podnio != undefined) {
            _podnio = this._el.evd_podnio > 0 ? true : false;
        }

        return _podnio;
    }

    get lockedExt(): boolean {

        let _lockedExt: boolean = this._el.locked_ext ?? false;
        return _lockedExt;
    }

    get stop(): boolean {

        let _evdStop: boolean = false;
        if (this._el.evd_kontrolisao != undefined) {
            _evdStop = this._el.evd_kontrolisao > 0 ? true : false;
        }

        return _evdStop;
    }

    get sendButtOn(): boolean {
        //HACK: eCalendarService.sendButtOn odredjuje da li je button Podnesi (sendButtOn=TRUE) ili Opozovi (sendButtOn=FALSE)
        return this._sendButtonOn;
    }

    get saveButtOn(): boolean {

        return this._saveButtonOn;
    }

    set saveButtOn(value: boolean) {

        this._saveButtonOn = value;
    }

    get disabledButton(): boolean {

        return this._disabledButton;
    }


    public sendDisableSet() {
        let _el: EvidDnevnik = this._evidDnevnikData.find(el => el.locked_ext === true || el.locked_ext === false) || {} as EvidDnevnik;
        this._evdLockedExt = _el.locked_ext ?? false;

        this._evdStop = (_el.evd_kontrolisao || 0) > 0 ? true : false;
        this._podnio = (_el.evd_podnio || 0) > 0 ? true : false;

        switch (this.usersession.user.role) {
            case AppRole.Uposlenik: {
                this._sendButtonOn = !(this._evdLockedExt || this._podnio);
            }
            case 'sekretarica': {
                //HACK: mora biti TRUE da bi PODNESI bio omogućen
                this._sendButtonOn = !(this._evdLockedExt || this._podnio) && ((this._el.evd_kontrolisao || 0) > 0);
            }
        }

        this._sendButtonOn = !(this._evdLockedExt || this._podnio);

    }

    public sendDisable() {

        switch (this.usersession.user.role) {
            case AppRole.Uposlenik: {


                switch (this.sendButtOn) {
                    case true: {
                        this._disabledButton = this.lockedExt || this.isPodnio;
                        break;
                    }

                    case false: {
                        this._disabledButton = this.lockedExt || this.stop || !this.isPodnio;
                        break;
                    }
                }

                break;
            }
            case 'sekretarica': {

                switch (this.sendButtOn) {
                    case true: {
                        this._disabledButton = this.lockedExt || this.isPodnio || (this._el.evd_kontrolisao === 0);
                        break;
                    }

                    case false: {
                        this._disabledButton = this.lockedExt || this.stop || !this.isPodnio || (this._el.evd_kontrolisao === 0);
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

    convertToDay(_dummyData: string) {

        this._evidDnevnikData = JSON.parse(_dummyData, (field, value) => {
            let dupValue: string = value;
            if (typeof value === 'string' && /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*){1})([zZ]|([+\-])(\d\d):?(\d\d))?$/.test(value)) {
                let arr = dupValue.split(/[^0-9]/);

                //let dt = arr[2];
                let dt = new Date();
                dt = new Date(Date.UTC(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, parseInt(arr[2], 10),
                    parseInt(arr[3], 10), parseInt(arr[4], 10), parseInt(arr[5], 10)));
                dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());

                return dt;
            } else {

                return value;
            };

        });
    }

    processCalendarData() {

        this.evidCalendarData = new Array<EvidCalendar>();

        let _firstDay: number = this._evidDnevnikData[0].week_day || 0;
        let _lastDay: number = new Date(+(this._evidDnevnikData[this._evidDnevnikData.length - 1].datum || {})).getDate();

        let _lastCalDay = _lastDay <= 35 ? 35 : 42;

        // Dani prije početka mjeseca !!!
        for (let _i = 0; _i < _firstDay; _i++) {
            let _oneCal = new EvidCalendar();
            let _dt = new Date((this._evidDnevnikData[0].datum || ''));
            _dt.setDate(_dt.getDate() - (_firstDay - _i));

            _oneCal.datum = _dt;
            _oneCal.day = _dt.getDate().toString();
            _oneCal.css = 'e-outline e-block';
            _oneCal.disabled = true;
            this.evidCalendarData.push(_oneCal);

        }

        for (let _oneEvdDn of this._evidDnevnikData.filter(el =>
            el.keyday === true)) {

            let _oneCal = new EvidCalendar();
            _oneCal.datum = new Date(_oneEvdDn.datum || '');
            _oneCal.sifra = _oneEvdDn.sifra_placanja;
            _oneCal.day = _oneCal.datum.getDate().toString();

            // Štimanje CSS zavisno od šifre - smješta se u opis_rada
            if (_oneEvdDn.sifra_placanja === 'PLC') {
                _oneCal.css = ('sfr-plc');
            } else if (_oneEvdDn.sifra_placanja === 'NPL') {
                _oneCal.css = ('sfr-npl');
            } else if (_oneEvdDn.sifra_placanja === 'BOL') {
                _oneCal.css = ('sfr-bol');
            } else if (_oneEvdDn.sifra_placanja === 'POD') {
                _oneCal.css = ('sfr-pod');
            } else if (_oneEvdDn.sifra_placanja === 'PRV') {
                _oneCal.css = ('sfr-prv');
            } else if (_oneEvdDn.sifra_placanja === 'SND') {
                _oneCal.css = ('sfr-snd');
            } else if (_oneEvdDn.sifra_placanja === 'SP') {
                _oneCal.css = ('sfr-sp');
            } else if ((_oneEvdDn.sifra_placanja || '').indexOf('GO') >= 0) {
                _oneCal.css = ('sfr-go');
            } else if (_oneEvdDn.sifra_placanja === 'RRK') {
                _oneCal.css = ('sfr-rrk');
            } else if (_oneEvdDn.sifra_placanja === 'RRD') {
                _oneCal.css = ('sfr-rrd');
            } else {
                _oneCal.css = ('sfr-none');
            }

            _oneCal.css += ' e-outline e-block';

            if ((_oneEvdDn.locked === true) && (_oneEvdDn.evd_podnio === 0)) {
                _oneCal.css += ' sfr-lock';
                //_oneCal.disabled = true;
            } else {
                _oneCal.disabled = false;
            }

            this.evidCalendarData.push(_oneCal);

            this.calcSati((_oneCal.sifra || ''), +8);
        }

        for (let _i = _lastDay + 1; _i <= 42; _i++) {
            let _oneCal = new EvidCalendar();
            _oneCal.datum = new Date();
            _oneCal.day = (_i - _lastDay).toString();
            _oneCal.css = 'e-outline e-block';
            _oneCal.disabled = true;
            this.evidCalendarData.push(_oneCal);
        }

        for (let _i = 0; _i < 6; _i++) {
            let _oneCalWeek = new EvidCalendarWeek();
            _oneCalWeek.pon = _i * 7;
            _oneCalWeek.uto = _i * 7 + 1;
            _oneCalWeek.sri = _i * 7 + 2;
            _oneCalWeek.cet = _i * 7 + 3;
            _oneCalWeek.pet = _i * 7 + 4;
            _oneCalWeek.sub = _i * 7 + 5;
            _oneCalWeek.ned = _i * 7 + 6;

            this.evidCalendarWeekData.push(_oneCalWeek);
        }

    }

    calcSati(_sifra: string, _add: number) {

        this.SumSati = 0;
        this.sfrevidprisData.forEach(el => {
            if (el.sifra === "SND") return el;

            if (el.sifra === _sifra && _sifra.length > 0 && _sifra.indexOf('GO') < 0) el.sati = (el.sati || 0) + _add;
            if ((el.sifra || '').indexOf('GO') >= 0 && _sifra.indexOf('GO') >= 0) el.sati = (el.sati || 0) + _add;

            this.SumSati += (el.sati || 0);
            return el;
        });
        this.SumSatiObs.next(this.SumSati);
    }

    resetSati() {

        this.SumSati = 0;
        this.sfrevidprisData.forEach(el => {
            el.sati = 0;
            this.SumSati += el.sati;
            return el;
        });
        this.SumSatiObs.next(this.SumSati);
    }

    evidDnevnikAdd(_evidDnevnik: EvidDnevnik) {

        if (_evidDnevnik.sifra_placanja === "SP") {
            const foundSifra = this.sfrevidprisData.find(e => (e.sifra || '') === (_evidDnevnik.sifra_placanja || ''));
            _evidDnevnik.opis_rada = foundSifra ? foundSifra.title : '';
            if ((_evidDnevnik.vrijeme_od || '').length != 5) { _evidDnevnik.vrijeme_od = "08:00" };
            if ((_evidDnevnik.vrijeme_do || '').length != 5) { _evidDnevnik.vrijeme_do = "16:00" };

        } else if (_evidDnevnik.sifra_placanja === "SND") {
            _evidDnevnik.opis_rada = " ";
            _evidDnevnik.vrijeme_od = " ";
            _evidDnevnik.vrijeme_do = " ";

        } else if (_evidDnevnik.sifra_placanja != "RRD" && _evidDnevnik.sifra_placanja != "RRK" && _evidDnevnik.sifra_placanja != "") {
            const foundSifra = this.sfrevidprisData.find(e => e.sifra === (_evidDnevnik.sifra_placanja || ''));
            _evidDnevnik.opis_rada = "odsustvo - " + (foundSifra ? foundSifra.title : '');
            _evidDnevnik.vrijeme_od = "08:00";
            _evidDnevnik.vrijeme_do = "16:00";

            // SUb i NED ne mogu biti BOL, GO, PL ...
            if ((_evidDnevnik.sifra_placanja === "NPL" || _evidDnevnik.sifra_placanja === "PLC" || _evidDnevnik.sifra_placanja === "POD"
                || _evidDnevnik.sifra_placanja === "GO")
                && (_evidDnevnik.week_day === 5 || _evidDnevnik.week_day === 6)) {
                _evidDnevnik.sifra_placanja = "SND";
                _evidDnevnik.opis_rada = " ";
                _evidDnevnik.vrijeme_od = " ";
                _evidDnevnik.vrijeme_do = " ";
            }

            if ((_evidDnevnik.sifra_placanja === "GO") && ((_evidDnevnik.week_day || 0) < 5)) {

                if ((this.godOdm.yprev_rjes || 0) - (this.godOdm.yprev_isk || 0) > 0) {
                    _evidDnevnik.sifra_placanja = "GO-" + ((this.godOdm.ycurr || 0) - 1);
                    _evidDnevnik.opis_rada = _evidDnevnik.sifra_placanja;
                    if (this.godOdm && this.godOdm.yprev_isk) {
                        this.godOdm.yprev_isk += 1;
                    }

                    _evidDnevnik.vrijeme_od = "08:00";
                    _evidDnevnik.vrijeme_do = "16:00";
                } else if ((this.godOdm.ycurr_rjes || 0) - (this.godOdm.ycurr_isk || 0) > 0) {
                    _evidDnevnik.sifra_placanja = "GO-" + (this.godOdm.ycurr);
                    _evidDnevnik.opis_rada = _evidDnevnik.sifra_placanja;
                    if (this.godOdm && this.godOdm.ycurr_isk) {
                        this.godOdm.ycurr_isk += 1;
                    }

                    _evidDnevnik.vrijeme_od = "08:00";
                    _evidDnevnik.vrijeme_do = "16:00";
                } else {
                    _evidDnevnik.sifra_placanja = "SND";
                    _evidDnevnik.opis_rada = " ";
                    _evidDnevnik.vrijeme_od = " ";
                    _evidDnevnik.vrijeme_do = " ";
                }


            }

            //_evidDnevnikData.push(_evidDnevnik);
        } else if (_evidDnevnik.sifra_placanja === "RRD") {
            const foundSifra = this.sfrevidprisData.find(e => (e.sifra || '') === (_evidDnevnik.sifra_placanja || ''));
            _evidDnevnik.opis_rada = foundSifra ? foundSifra.title : '';
            _evidDnevnik.vrijeme_od = "08:00";
            _evidDnevnik.vrijeme_do = "16:00";
        } else if (_evidDnevnik.sifra_placanja === "RRK") {
            const foundSifra = this.sfrevidprisData.find(e => (e.sifra || '') === (_evidDnevnik.sifra_placanja || ''));
            _evidDnevnik.opis_rada = foundSifra ? foundSifra.title : '';
            _evidDnevnik.vrijeme_od = "08:00";
            _evidDnevnik.vrijeme_do = "16:00";
        } else {
            _evidDnevnik.opis_rada = " ";
            _evidDnevnik.vrijeme_od = " ";
            _evidDnevnik.vrijeme_do = " ";
        }

        this.setGoStatus();

    }

    evidDay(_day: number) {

        let _evidDnevnik: EvidDnevnik;

        if (this._selEvid != undefined && this._sendButtonOn === true) {

            _evidDnevnik = this._evidDnevnikData.filter(el => {
                let _elDay = new Date(el.datum || '');
                if (this.evidCalendarData[_day] && _elDay.getDate() === this.evidCalendarData[_day]?.datum?.getDate() && el.keyday === true) {
                    return el;
                }
            })[0];

            if ((_evidDnevnik.locked === true) && (this.usersession.user.role === "uposlenik")) {
                return;
            }

            if ((this.evidCalendarData[_day].sifra === this._selEvid.sifra) ||
                ((this.evidCalendarData[_day].sifra?.indexOf('GO') ?? -1) >= 0 && this._selEvid.sifra === "GO")) {
                //HACK: ukini šifru        
                this.evidCalendarData[_day].css = 'e-outline e-block';
                this.evidCalendarData[_day].sifra = "";

                this.calcSati((this._selEvid.sifra || ''), -8);
                _evidDnevnik.sifra_placanja = "";
                _evidDnevnik.locked = false;

                this.evidDnevnikAdd(_evidDnevnik);
            } else if (this.evidCalendarData[_day].sifra === "") {
                //console.log("butClick1: " + JSON.stringify(this.evidCalendarData[_day]));
                //console.log("butClick1: " + JSON.stringify(_evidDnevnik));
                // Dodaj šifru  
                if (((_evidDnevnik.week_day === 5) || (_evidDnevnik.week_day === 6))) {

                    if ((this._selEvid.sifra === "RRD") || (this._selEvid.sifra === "RRK") || (this._selEvid.sifra === "SP") || (this._selEvid.sifra === "SND")) {

                        this.evidCalendarData[_day].css = this._selEvid.css + ' e-outline e-block';
                        this.evidCalendarData[_day].sifra = this._selEvid.sifra;

                        this.calcSati(this.evidCalendarData[_day].sifra, 8);

                        // --------------------------------------------------------------------------
                        // HACK: dodaj GO u _evidDnevnik     
                        _evidDnevnik.sifra_placanja = this._selEvid.sifra;

                        this.evidDnevnikAdd(_evidDnevnik);
                    } else {

                    }

                } else {

                    this.evidCalendarData[_day].css = this._selEvid.css + ' e-outline e-block';
                    this.evidCalendarData[_day].sifra = this._selEvid.sifra;

                    this.calcSati(this.evidCalendarData[_day].sifra || '', 8);

                    // --------------------------------------------------------------------------
                    // HACK: dodaj GO u _evidDnevnik     
                    _evidDnevnik.sifra_placanja = this._selEvid.sifra;

                    if ((this.chkSuperLock === true) && (_evidDnevnik.week_day != 5) && (_evidDnevnik.week_day != 6) && (_evidDnevnik.sifra_placanja != "RRD") && (_evidDnevnik.sifra_placanja != "RRK")) {
                        _evidDnevnik.locked = true;
                        this.evidCalendarData[_day].css += ' sfr-lock';
                    }

                    this.evidDnevnikAdd(_evidDnevnik);

                }

            }

            if (this.evidCalendarData[_day].sifra != "RRD") {

                for (let _oneEvdDn of this._evidDnevnikData.filter(el => {
                    let _elDay = new Date(el.datum || '');
                    if (_elDay.getDate() === this.evidCalendarData[_day].datum?.getDate() && el.keyday != true) {
                        return el;
                    }
                })) {
                    if (_oneEvdDn.id !== undefined) {
                        if (_oneEvdDn.id !== undefined) {
                            if (_oneEvdDn.id !== undefined) {
                                _oneEvdDn.id = -_oneEvdDn.id;
                            }
                        }
                    }
                }

            }

        }

    }

    autoPopulate() {

        if (this._selEvid != undefined) {

            this.evidCalendarData.forEach(el => {
                if (el.disabled === true) return el;


                let _evidDnevnik: EvidDnevnik;
                _evidDnevnik = this._evidDnevnikData.filter(eld => {
                    let _elDay = new Date(eld.datum || '');

                    if (el.datum && _elDay.getDate() === el.datum.getDate() && eld.keyday === true) {
                        return eld;
                    }
                })[0];

                //HACK: Nadredjena evidencija - EXIT
                if (_evidDnevnik.locked && this.usersession.user.role === "uposlenik") return el;

                if ((el.sifra === this._selEvid.sifra) ||
                    (el.sifra || ''.indexOf('GO') >= 0 && this._selEvid.sifra === "GO")) {

                } else if (el.sifra === "") {
                    // Dodaj šifru     
                    if (((_evidDnevnik.week_day === 5) || (_evidDnevnik.week_day === 6)) && (_evidDnevnik.sifra_placanja != "RRD") && (_evidDnevnik.sifra_placanja != "RRK") && (_evidDnevnik.sifra_placanja != "SP") && (_evidDnevnik.sifra_placanja != "SND")) {
                        return el;
                    }

                    el.css = this._selEvid.css + ' e-outline e-block';
                    el.sifra = this._selEvid.sifra;

                    this.calcSati(el.sifra || '', 8);

                    // --------------------------------------------------------------------------
                    // HACK: dodaj GO u _evidDnevnik      
                    _evidDnevnik.sifra_placanja = this._selEvid.sifra;

                    if ((this.chkSuperLock === true) && (_evidDnevnik.week_day != 5) && (_evidDnevnik.week_day != 6) && (_evidDnevnik.sifra_placanja != "RRD") && (_evidDnevnik.sifra_placanja != "RRK")) {
                        _evidDnevnik.locked = true;
                        el.css += ' sfr-lock';
                    }

                    this.evidDnevnikAdd(_evidDnevnik);
                }

                if (el.sifra != "RRD") {

                    for (let _oneEvdDn of this._evidDnevnikData.filter(eld => {
                        let _elDay = new Date(eld.datum || '');
                        if (el.datum && _elDay.getDate() === el.datum.getDate() && eld.keyday != true) {
                            return eld;
                        }
                    })) {
                        if (_oneEvdDn.id !== undefined) {
                            _oneEvdDn.id = -_oneEvdDn.id;
                        }
                    }

                }

                return el;
            })

        }

    }

    autoDelete() {

        if (this._selEvid != undefined) {

            this.evidCalendarData.forEach(el => {
                if (el.disabled === true) return el;

                let _evidDnevnik: EvidDnevnik;
                _evidDnevnik = this._evidDnevnikData.filter(eld => {
                    let _elDay = new Date(eld.datum || '');

                    if (el.datum && _elDay.getDate() === el.datum.getDate() && eld.keyday === true) {
                        return eld;
                    }
                })[0];

                //HACK: Nadredjena evidencija - EXIT
                if (_evidDnevnik.locked && this.usersession.user.role === "uposlenik") return el;

                if ((el.sifra === this._selEvid.sifra) ||
                    (el.sifra || ''.indexOf('GO') >= 0 && this._selEvid.sifra === "GO")) {
                    //HACK: ukini šifru       
                    el.css = 'e-outline e-block';
                    el.sifra = "";

                    this.calcSati(this._selEvid.sifra || '', -8);
                    _evidDnevnik.sifra_placanja = "";
                    _evidDnevnik.locked = false;
                    this.evidDnevnikAdd(_evidDnevnik);
                } else if (el.sifra === "") {
                    //  // Dodaj šifru        
                    //  el.css =this._selEvid.css + ' e-outline e-block';
                    //  el.sifra = this._selEvid.sifra;

                    //  this.calcSati(el.sifra, 8);

                    //  // --------------------------------------------------------------------------
                    //  // HACK: dodaj GO u _evidDnevnik      
                    //  _evidDnevnik.sifra_placanja = this._selEvid.sifra;

                    //  this.evidDnevnikAdd(_evidDnevnik);   
                }

                if (el.sifra != "RRD") {

                    for (let _oneEvdDn of this._evidDnevnikData.filter(eld => {
                        let _elDay = new Date(eld.datum || '');
                        if (el.datum && _elDay.getDate() === el.datum.getDate() && eld.keyday != true) {
                            return eld;
                        }
                    })) {
                        if (_oneEvdDn.id !== undefined) {
                            _oneEvdDn.id = -_oneEvdDn.id;
                        }
                    }

                }

                return el;
            })

        }

    }

    getSumSati(): Observable<number> {
        return this.SumSatiObs.asObservable();
    }

    setGodOdm(value: EvidGodOdm) {
        this.godOdm = value;
        this._goYPrevIsk = this.godOdm.yprev_isk || 0;
        this._goYCurrIsk = this.godOdm.ycurr_isk || 0;
        this.setGoStatus();
    }

    getGodOdm(): Observable<EvidGodOdm> {
        return this.godOdmObs.asObservable();
    }

    public setGoStatus() {

        if (this._podnio === false) {
            // Poredaj prevGO i curGO po datumima
            this.godOdm.ycurr_isk = this._goYCurrIsk;
            this.godOdm.yprev_isk = this._goYPrevIsk;

            for (let _evidDnevnik of this._evidDnevnikData.filter(el =>
                el.sifra_placanja || ''.startsWith("GO"))) {

                if (this.godOdm.yprev_rjes || 0 - this.godOdm.yprev_isk > 0) {
                    _evidDnevnik.sifra_placanja = "GO-" + (this.godOdm.ycurr || 0 - 1);
                    _evidDnevnik.opis_rada = _evidDnevnik.sifra_placanja;
                    this.godOdm.yprev_isk += 1;
                } else if (this.godOdm.ycurr_rjes || 0 - this.godOdm.ycurr_isk > 0) {
                    _evidDnevnik.sifra_placanja = "GO-" + (this.godOdm.ycurr);
                    _evidDnevnik.opis_rada = _evidDnevnik.sifra_placanja;
                    this.godOdm.ycurr_isk += 1;
                }
            }

            let _goYPrevIskLoc = this._evidDnevnikData.filter(el => el.sifra_placanja || ''.startsWith("GO-" + (this.godOdm.ycurr || 0 - 1))).length;
            let _goYCurrIskLoc = this._evidDnevnikData.filter(el => el.sifra_placanja || ''.startsWith("GO-" + (this.godOdm.ycurr))).length;


            this.godOdm.ycurr_isk = _goYCurrIskLoc + this._goYCurrIsk;
            this.godOdm.yprev_isk = _goYPrevIskLoc + this._goYPrevIsk;
        }


        this.godOdmObs.next(this.godOdm);

    }
}
