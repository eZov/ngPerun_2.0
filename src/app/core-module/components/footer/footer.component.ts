import { Component, OnInit } from '@angular/core';
import { APIversionService }  from '../../../core-services/apiversion.service';

@Component({
  selector: 'nga-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {


  currentText!: string;

  constructor(
    private infoVer: APIversionService
  ) { }

  ngOnInit() {


    this.infoVer.infoVersion.subscribe(
      (infoTxt: string) => {

        this.currentText =  infoTxt;

      }, error => {
        console.log(error);
      }
    );

  }

}
