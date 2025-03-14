import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  // HACK:The values that are defined here are the default values that can
  // be overridden by env.js

  public apiUrl = '';
  public enableDebug = true;  

  constructor() { }
}
