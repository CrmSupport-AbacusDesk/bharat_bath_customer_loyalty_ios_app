import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ReceiveRemarkModalPage } from '../receive-remark-modal/receive-remark-modal';

/**
* Generated class for the RedeemHistoryDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-redeem-history-detail',
  templateUrl: 'redeem-history-detail.html',
})
export class RedeemHistoryDetailPage {
  
  gift_id:any ='';
  data:any ={};
  url:any ='';
  toggle:boolean = false;
  constructor(public navCtrl: NavController, public alertCtrl:AlertController, public modalCtrl: ModalController, public navParams: NavParams, public dbService: DbserviceProvider) {
    this.url = this.dbService.upload_url3;
    console.log(this.url);
    
    console.log(dbService.userStorageData.id);
    
    
    this.gift_id = navParams.get('gift_id')
    console.log(this.gift_id);
    
    console.log(navParams);
    this.getKarigarDetail()
    
  }
  
  ionViewDidLoad() {
    this.dbService.presentLoading();
  }
  
  
  getKarigarDetail()
  {
    console.log('karigar');
    
    this.dbService.onPostRequestDataFromApi( {'id': this.gift_id },'app_karigar/redeemDetail', this.dbService.rootUrl).subscribe(r =>
      {
        this.dbService.onDismissLoadingHandler();
        console.log(r);
        this.data = r.transaction;
        console.log(this.data);
        
        
        
      });
    }
    
    
    recvConfirmation()
    {
      let ReceiveModal = this.modalCtrl.create(ReceiveRemarkModalPage,{'gift_id':this.gift_id});
      ReceiveModal.onDidDismiss(data => {
        this.getKarigarDetail();
      });
      ReceiveModal.present();
      // this.dbService.onPostRequestDataFromApi({'id':gift_id,'karigar_id':this.service.karigar_id},'app_karigar/redeemReceiveStatus',this.dbService.rootUrl).subscribe(r=>
      //   {
      //     console.log(r);
      //     // this.navCtrl.setRoot(TabsPage,{index:'3'});
      //     //   this.navCtrl.push(TransactionPage);
      //     this.showSuccess('Thank you for your feedback!')
      //     this.getTransactionDetail('');
      //     // this.getTransactionDetail()
      //   });
      // alert.present();
    }
    
    submit()
    {
      this.dbService.post_rqst({'id':this.gift_id,'karigar_id':this.dbService.userStorageData.id,'remark':this.data.receiving_remark},'app_karigar/redeemReceiveStatus').subscribe(r=>
        {
          console.log(r);
          // this.navCtrl.setRoot(TabsPage,{index:'3'});
          this.toggle = false
          this.getKarigarDetail();
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
    