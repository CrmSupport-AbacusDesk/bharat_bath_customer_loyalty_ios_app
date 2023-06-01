import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, ToastController } from 'ionic-angular';
import { OffersPage } from '../offers/offers';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";

import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { HomePage } from '../home/home';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-offer-list',
  templateUrl: 'offer-list.html',
})
export class OfferListPage {
  offer_list:any=[];
  loading:Loading;
  filter:any={};
  flag:any='';
  lang:any='en';
  tokenInfo:any={};
  url:string='';
  offer: string = "active";
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dbService:DbserviceProvider,
    public db:DbserviceProvider,
    public toastCtrl: ToastController,
    public loadingCtrl:LoadingController,
    private app:App,
    public storage:Storage,
    public translate:TranslateService,) {
      this.url = db.upload_url3
      this.lang = this.navParams.get("lang");
      console.log('====================================');
      console.log(this.lang);
      console.log('====================================');
      
      if(this.dbService.connection=='offline')
      {
        // this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
        this.navCtrl.setRoot(HomePage);
      }
    }
    
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad OfferListPage');
      if(this.dbService.connection!='offline')
      this.translate.setDefaultLang(this.lang);
      this.translate.use(this.lang);
      {
        this.getofferList('active');
        // this.dbService.presentLoading();
      }
    }
    
    doRefresh(refresher)
    {
      console.log('Begin async operation', refresher);
      this.getofferList('active');
      refresher.complete(); 
    }
    
    goOnOffersPage(id, status)
    {
      
      if(status == 'Deactive'){
        const toast = this.toastCtrl.create({
          message: 'Offer is decative',
          duration: 3000
        });
        toast.present();
        return
      }
      else{
        this.navCtrl.push(OffersPage,{'id':id,lang:this.lang});
      }
      
      
    }
    getofferList(offer_status)
    {
      this.dbService.presentLoading();
      this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id, 'status':offer_status},'app_karigar/offerList', this.dbService.rootUrl).subscribe(r=>
        {
          console.log(r);
          this.dbService.onDismissLoadingHandler();
          this.offer_list=r['offer'];
          console.log(this.offer_list);
        });
      }
      
      
      get_user_lang()
      {
        this.storage.get("token")
        .then(resp=>{
          this.tokenInfo = this.getDecodedAccessToken(resp );
          
          this.db.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
          .subscribe(resp=>{
            console.log(resp);
            this.lang = resp['language'];
            if(this.lang == "")
            {
              this.lang = "en";
            }
            this.translate.use(this.lang);
          })
        })
      }
      
      getDecodedAccessToken(token: string): any {
        try{
          return jwt_decode(token);
        }
        catch(Error){
          return null;
        }
      }
      
      ionViewDidLeave()
      {
        if(this.dbService.connection!='offline')
        {
          let nav = this.app.getActiveNav();
          if(nav && nav.getActive())
          {
            let activeView = nav.getActive().name;
            let previuosView = '';
            if(nav.getPrevious() && nav.getPrevious().name)
            {
              previuosView = nav.getPrevious().name;
            }
            console.log(previuosView);
            console.log(activeView);
            console.log('its leaving');
            if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
            {
              
              console.log(previuosView);
              this.navCtrl.popToRoot();
            }
          }
        }
      }
    }
    