import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
  selector: 'page-cancelation-policy',
  templateUrl: 'cancelation-policy.html',
})
export class CancelationPolicyPage {
  cancellationspolicy:any='';
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:DbserviceProvider) {
  }

  ionViewDidLoad() {
    this.getcancellationspolicy();
  }

  getcancellationspolicy(){
    this.dbService.onPostRequestDataFromApi({"page":"Cancellation Policy"},'app_karigar/content_policy', this.dbService.rootUrl)
        .subscribe((r)=>
        {
            console.log(r);
            this.cancellationspolicy=r.content.content
            console.log("policy",this.cancellationspolicy)
        });
  }

}
