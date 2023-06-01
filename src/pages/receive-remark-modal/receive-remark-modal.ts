import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
// import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';
import { RedeemHistoryDetailPage } from '../redeem-history-detail/redeem-history-detail';


@IonicPage()
@Component({
  selector: 'page-receive-remark-modal',
  templateUrl: 'receive-remark-modal.html',
})
export class ReceiveRemarkModalPage {
  data:any={};
  gift_id:any='';


  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public alertCtrl:AlertController,public service:DbserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiveRemarkModalPage');
    this.gift_id = this.navParams.get('gift_id');

  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }

  submit()
  {
    this.service.post_rqst({'id':this.gift_id,'karigar_id':this.service.karigar_id,'remark':this.data.receiving_remark},'app_karigar/redeemReceiveStatus').subscribe(r=>
      {
        console.log(r);
        // this.navCtrl.setRoot(TabsPage,{index:'3'});
        this.navCtrl.push(RedeemHistoryDetailPage, {'gift_id':this.gift_id});
        this.showSuccess('Thanks for confirmation')
      });

     
      // alert.present();
  }

  showSuccess(text)
  {
    let alert = this.alertCtrl.create({
      title:'Success!',
      cssClass:'action-close',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  
}
