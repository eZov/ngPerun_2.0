import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Putnal } from '../model/putnal.model';
import { RestDataSource } from '../shared/rest.datasource';

export interface Relation {
  id: number;
  relacija: string;
  dat_polaska: Date;
  vri_polaska: Date;  
  dat_povratka: Date;
  vri_povratka: Date;    
}

@Injectable()
export class RelationService {
  private _relations: Relation[] = [];

    constructor(
        private restDataSource: RestDataSource
    ) {

        let _defRelation: Relation = {
            id: 1,
            relacija: "polazak - povratak",
            dat_polaska: new Date(),
            vri_polaska: new Date(),
            dat_povratka: new Date(),
            vri_povratka: new Date()
        };

        this._relations.push(_defRelation);

    }


    clear() {
        this._relations = [];
    }

    addItem(_item: Relation) {
        this._relations.push(_item);
    }

    removeItem(itemId: number) {
        this._relations = this._relations
            .filter(item => item.id === itemId);
    }

    //HACK get je Property!!
    get relations(): Relation[] {
        return this._relations;
    }

}