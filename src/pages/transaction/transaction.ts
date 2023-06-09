import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, AlertController } from 'ionic-angular';
import { ShippingDetailPage } from '../shipping-detail/shipping-detail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html',
})
export class TransactionPage {
  transaction_detail:any=[];
  balance_point:any='';
  filter:any={};
  loading:Loading;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public loadingCtrl:LoadingController,
              private app: App,
              public alertCtrl:AlertController) {

          this.dbService.presentLoading();
  }

  ionViewWillEnter()
  {
    console.log('ionViewDidLoad TransactionPage');
    this.getTransactionDetail();
  }

  doRefresh(refresher)
  {
    console.log('Begin async operation', refresher);
    this.getTransactionDetail();
    refresher.complete();
  }

  goOnShippingPage(id){
    console.log('shipping');
    this.navCtrl.push(ShippingDetailPage,{'id':id});
  }

  goOnChatingPage(){
    // this.navCtrl.push(ChatingPage);
  }
  getTransactionDetail()
  {
    this.filter.limit=0;
    this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'filter':this.filter},'app_karigar/transaction', this.dbService.rootUrl).subscribe(r=>
      {
        console.log(r);
        if(r)
        {
          this.dbService.onDismissLoadingHandler();
          this.transaction_detail=r['transaction']
          this.balance_point=parseInt(r['karigar'].balance_point) + parseInt(r['karigar'].reg_points);
        }
      });
    }


    recvConfirmation(gift_id)
    {
      console.log('shipping page');

      let alert=this.alertCtrl.create({
        title:'Confirmation!',
        subTitle: 'Did you receive this gift?',
        cssClass:'action-close',

        buttons: [{
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text:'Yes',
          cssClass: 'close-action-sheet',
          handler:()=>
          {
            console.log(gift_id);
            this.dbService.onPostRequestDataFromApi({'id':gift_id,'karigar_id':this.dbService.userStorageData.id},'app_karigar/redeemReceiveStatus', this.dbService.rootUrl).subscribe(r=>
              {
                console.log(r);
                this.showSuccess('You have receive gift successfully')
                this.getTransactionDetail()
              });
          }
        }]
      });
      alert.present();

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

      flag:any='';
      loadData(infiniteScroll)
      {
        console.log('loading');

        this.filter.limit=this.transaction_detail.length;
        this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'filter':this.filter},'app_karigar/transaction', this.dbService.rootUrl).subscribe(r=>
          {
            console.log(r);
            if(r['transaction']=='')
            {
              this.flag=1;
            }
            else
            {
              setTimeout(()=>{
                this.transaction_detail=this.transaction_detail.concat(r['transaction']);
                console.log('Asyn operation has stop')
                infiniteScroll.complete();
              },1000);
            }
          });
        }

        ionViewDidLeave() {

          let nav = this.app.getActiveNav();

          if(nav && nav.getActive()) {

            let activeView = nav.getActive().name;

            let previuosView = '';
            if(nav.getPrevious() && nav.getPrevious().name) {
              previuosView = nav.getPrevious().name;
            }

            console.log(previuosView);

            console.log(activeView);
            console.log('its leaving');

            if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage')) {

              console.log(previuosView);
              this.navCtrl.popToRoot();
            }
          }

        }

      }
