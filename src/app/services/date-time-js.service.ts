import { Injectable } from "@angular/core";



@Injectable({
    providedIn: 'root'
})
export class DateTimeJsService {

    constructor() {

    }

    public yearMonth(_dateTime: string): Record<string, number> {

        let arr = _dateTime.split(/[^0-9]/);

        let dt = new Date();
        dt = new Date(Date.UTC(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, parseInt(arr[2], 10),
            parseInt(arr[3], 10), parseInt(arr[4], 10), parseInt(arr[5], 10)));
        dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());

        let _yyyyMM: Record<string, number> = {};
        _yyyyMM['YYYY'] = parseInt(arr[0], 10);
        _yyyyMM['MM'] = parseInt(arr[1], 10);
        return _yyyyMM;
    }

    public toIsoString(date: any) {
        var tzo = -date.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function(num: any) {
                var norm = Math.floor(Math.abs(num));
                return (norm < 10 ? '0' : '') + norm;
            };
      
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            dif + pad(tzo / 60) +
            ':' + pad(tzo % 60);
      }    

}
