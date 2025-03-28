import { Injectable, Inject } from '@angular/core';
import { WINDOW } from '../window.providers';

@Injectable()
export class LocationService {

    constructor(@Inject(WINDOW) private window: Window) {
    }

    getHostname() : string {
        return this.window.location.hostname;
    }
}