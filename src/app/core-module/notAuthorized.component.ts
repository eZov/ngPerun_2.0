import { Component } from "@angular/core";

@Component({
    selector: "paNotFound",
    template: ` <div #container class="container-fluid">
    <div class="row">
      <div class="col-sm-12 bg-light">
        <hr />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 bg-light text-center">
        <h1 class="fw-light">NIJE DOZVOLJEN PRISTUP ZA ODABRANU ROLU</h1>
        <p class="lead">Odabrana rola nema dozvolu za pristup ovom linku ...</p>
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
          NIJE DOZVOLJEN PRISTUP ZA ODABRANU ROLU
        </h2>
      </div>
    </div>
  </div>`
})
export class NotAuthorizedComponent {}
