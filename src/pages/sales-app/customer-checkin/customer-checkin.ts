import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CheckinDetailPage } from '../checkin-detail/checkin-detail';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';

/**
 * Generated class for the CustomerCheckinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-checkin',
  templateUrl: 'customer-checkin.html',
})
export class CustomerCheckinPage {
  customer_checkin_list:any = [];
  load_data:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService: DbserviceProvider) {

    this.customer_checkin_list = this.navParams.get('data');
    this.load_data = this.navParams.get('load_data');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerCheckinPage');
  }

  checkin_detail(checkin_id)
  {
    console.log(checkin_id);

    this.dbService.onPostRequestDataFromApi({'checkin_id':checkin_id},'Checkin/checkin_detail', this.dbService.rootUrlSfa).subscribe((result)=>
    {
      console.log(result);
      if(result)
      {
        this.navCtrl.push(CheckinDetailPage,{'checkin_data':result});
      }
    })


  }

}
