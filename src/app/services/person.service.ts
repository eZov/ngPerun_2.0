import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RestDataSource } from "../shared/rest.datasource";
import { Resolve } from '@angular/router';
import { Person } from '../model/person.model';

@Injectable({
  providedIn: "root",
})
export class PersonService {
  _personAdded: Person[] = new Array<Person>();
  _personChanged: Person[] = new Array<Person>();
  _personDeleted: Person[] = new Array<Person>();

  processEnded = new Subject<Boolean>();

  constructor(private restDataSource: RestDataSource) {}

  resolve(): Observable<any> {
    return this.restDataSource.getPersonAll();
  }

  personArgs = (args: any) => {
    for (let _oneRec of args.batchChanges.addedRecords) {
      let _person: Person = _oneRec as Person;
      this._personAdded.push(_person);
    }

    for (let _oneRec of args.batchChanges.changedRecords) {
      let _person: Person = _oneRec as Person;
      this._personChanged.push(_person);
    }

    for (let _oneRec of args.batchChanges.deletedRecords) {
      let _person: Person = _oneRec as Person;
      this._personDeleted.push(_person);
    }
  };

  personProcess = () => {
    if (this._personAdded.length) {
      this.loopAdded(this._personAdded.shift());
    }

    if (this._personChanged.length) {
      this.loopChanged(this._personChanged.shift());
    }

    if (this._personDeleted.length) {
      this.loopDeleted(this._personDeleted.shift());
    }
  };

  loopAdded = (_onePerson: Person) => {
    console.log("bBS added:" + JSON.stringify(_onePerson));
    this.restDataSource.insPerson(_onePerson).subscribe(
      (result) => {
        if (this._personAdded.length) {
          this.loopAdded(this._personAdded.shift());
        } else {
          this.loopEnded();
        }
      },
      (err) => {
        console.log(err);
        this.loopEnded();
      }
    );
  };

  loopChanged = (_onePerson: Person) => {
    console.log("bBS changed:" + JSON.stringify(_onePerson));
    this.restDataSource.updPerson(_onePerson).subscribe(
      (result) => {
        if (this._personChanged.length) {
          this.loopChanged(this._personChanged.shift());
        } else {
          this.loopEnded();
        }
      },
      (err) => {
        console.log(err);
        this.loopEnded();
      }
    );
  };

  loopDeleted = (_onePerson: Person) => {
    console.log("bBS added:" + JSON.stringify(_onePerson));
    this.restDataSource.delPerson(_onePerson.Sifra).subscribe(
      (result) => {
        if (this._personDeleted.length) {
          this.loopDeleted(this._personDeleted.shift());
        } else {
          this.loopEnded();
        }
      },
      (err) => {
        console.log(err);
        this.loopEnded();
      }
    );
  };

  loopEnded = () => {
    console.log("loopEnded-changed:" + this._personChanged.length);
    console.log("loopEnded-added:" + this._personAdded.length);
    console.log("loopEndedSave-deleted:" + this._personDeleted.length);

    if (
      this._personAdded.length == 0 &&
      this._personChanged.length == 0 &&
      this._personDeleted.length == 0
    ) {
      this.processEnded.next(true);
    } else {
      this.processEnded.next(false);
    }
  };

  convertToDateTime = (_dummyDataGrid: string): Person[] => {
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
  };

  defKategorija = (_personData: Person[]): object[] => {
    let _kategorija = _personData
      .map((item) => {
        return item.KategorijaUposlenika;
      })
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    console.log("service-1 _statusFilt: " + JSON.stringify(_kategorija));

    let defKategorija: object[] = [];
    _kategorija.forEach((el) => defKategorija.push({ kategorija: el }));
    console.log("service-2 _statusFilt: " + JSON.stringify(defKategorija));

    return defKategorija;
  };

  defSpol = (_personData: Person[]): object[] => {
    let _spol = _personData
      .map((item) => {
        return item.Spol;
      })
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

    let defSpol: object[] = [];
    _spol.forEach((el) => defSpol.push({ spol: el }));
    console.log("service spol: " + JSON.stringify(defSpol));

    return defSpol;
  };

  defStatus = (_personData: Person[]): object[] => {
    let _status = _personData
      .map((item) => {
        return item.Status;
      })
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

    let defStatus: object[] = [];
    _status.forEach((el) => defStatus.push({ status: el }));

    return defStatus;
  };

}
