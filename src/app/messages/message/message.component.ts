import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'paMessages',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  lastMessage?: Message;
  private subs: Subscription[] = [];

  //preuzeto: https://stackoverflow.com/questions/59657412/how-can-we-create-modal-pop-up-in-angular-from-scratch

  @ViewChild('myModal', { static: false }) modal!: ElementRef;

  constructor(
    public messageService: MessageService,
    public router: Router
  ) {

    const sub1 = messageService.messages.subscribe(msg => {
      this.lastMessage = msg;
      console.log(`==> MessageComponent subscribe 1 ${JSON.stringify(this.lastMessage)}`);
      if (msg.show === true && msg.text !== undefined) {
        console.log(`==> MessageComponent subscribe 2 ${JSON.stringify(msg.text)}`);
        this.open();
      }
    });
    this.subs.push(sub1);

    const sub2 = router.events.subscribe(e => {
      if (e instanceof NavigationEnd || e instanceof NavigationCancel) {
        this.lastMessage = { text: '', error: false, show: false };
      }
    });
    this.subs.push(sub2);
  }

  ngOnInit(): void { }

  open() {
    this.modal.nativeElement.style.display = 'block';
  }

  close() {
    this.modal.nativeElement.style.display = 'none';
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
