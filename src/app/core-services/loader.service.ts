import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoaderService {
public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

private loading: boolean = false;

constructor() { }

display(value: boolean) {
    this.status.next(value);
}

setLoading(loading: boolean) {
  this.loading = loading;
}

getLoading(): boolean {
  return this.loading;
}
}