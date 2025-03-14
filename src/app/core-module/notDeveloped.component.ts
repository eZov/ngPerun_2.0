import { Component } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'paNotDeveloped',
  template: ` <div #container class="container-fluid">
    <div class="row">
      <div class="col-sm-12 bg-light">
        <hr />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 bg-light text-center">
        <h1 class="fw-light">FORMA {{ formName }} JE U FAZI RAZVOJA</h1>
        <p class="lead">Ova forma je trenutno u fazi razvoja...</p>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 bg-light">
        <hr />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 bg-light text-center">
        <h2 class="bg-danger text-white p-2">
          FORMA {{ formName }} JE U FAZI RAZVOJA
        </h2>
      </div>
    </div>
  </div>`,
})
export class NotDevelopedComponent {
  private subs: Subscription[] = [];
  public formName: string | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const urlHandler = {
      _this: this,
      next(value: UrlSegment[]) {
        this._this.formName = value[1].path.toUpperCase();
        console.log('--notDeveloped 3: ' + JSON.stringify(value[1].path));
      },
    };

    const sub1 = this.route.url.subscribe(urlHandler);
    this.subs.push(sub1);

  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    console.log("--notDeveloped ngOnDestroy...");
  }

}
