import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {
  offer_id:any='';
  terms_detail:any={};
  loading:Loading;
  url:any;
  mode:string='';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public loadingCtrl:LoadingController) {
               this.url =  dbService.upload_url3

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
    this.offer_id=this.navParams.get('id');
    this.mode=this.navParams.get('mode');
    this.getTermsDetail(this.offer_id);
    this.dbService.presentLoading()
  }
  getTermsDetail(offer_id)
  {
    console.log(offer_id);
   this.dbService.onPostRequestDataFromApi({'offer_id':offer_id,'karigar_id':22},'app_karigar/offerTermCondition', this.dbService.rootUrl).subscribe(r=>
    {
          console.log(r);
          this.dbService.onDismissLoadingHandler();
          this.terms_detail=r['offer'];
    });
  }
 
  }

