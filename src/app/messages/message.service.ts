import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  messages: Observable<Message> = new ReplaySubject<Message>(1);

  reportMessage(msg: Message | undefined) {
      (this.messages as Subject<Message | undefined>).next(msg);
  }  
}
