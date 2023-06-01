import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Loading, LoadingController, App, ToastController, AlertController, } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { OffersPage } from '../../offers/offers';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";
import { CancelpolicyModalPage } from '../../cancelpolicy-modal/cancelpolicy-modal';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
	selector: 'page-gift-detail',
	templateUrl: 'gift-detail.html',
})
export class GiftDetailPage {
	gift_id:any='';
	gift_detail:any={};
	balance_point:any='';
	loading:Loading;
	star:any='';
	rating_star:any='';
	otp:'';
	offer_balance:any=''
	total_balance:any='';
	karigar:any ={}
	lang:any='';
	tokenInfo:any={};
	url:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public dbService:DbserviceProvider,
			  public toastCtrl: ToastController,
              public loadingCtrl:LoadingController,
			  public alertCtrl:AlertController,
              private app: App,
			  public db:DbserviceProvider,
			  public storage:Storage,
			  public translate:TranslateService) {
				this.url = db.upload_url3
			  }

	ionViewDidLoad() {
		console.log('ionViewDidLoad GiftDetailPage');
		this.gift_id = this.navParams.get('id');
		this.getGiftDetail(this.gift_id)
		this.dbService.presentLoading();
	}

	getGiftDetail(gift_id)
	{
		console.log(gift_id);
		this.dbService.onPostRequestDataFromApi({'gift_id' :gift_id,'karigar_id':this.dbService.userStorageData.id},'app_karigar/giftDetail', this.dbService.rootUrl).subscribe( r =>
			{
				console.log(r);
				this.dbService.onDismissLoadingHandler()
				this.gift_detail=r['gift'];
				this.total_balance=r['karigar'].total_balance
				this.karigar=r['karigar']

				this.rating_star=parseInt(r['gift'].rating);
				console.log(this.gift_detail);
				this.offer_balance= parseInt(r['gift'].offer_balance );
				this.balance_point= parseInt(r['karigar'].balance_point ) + parseInt(r['karigar'].service_wallet_balance_points) + parseInt(r['karigar'].referal_point_balance);
				console.log(this.balance_point
					);
				
				this.gift_detail.coupon_points = parseInt( this.gift_detail.coupon_points );
				if(r['gift_star'])
				{
					this.star=parseInt(r['gift_star'].star);
					console.log(this.star);
				}

			});
		}

	presentCancelPolicyModal() {

		if(this.karigar.status != 'Verified'){
			let alert = this.alertCtrl.create({
				title:'Sorry!',
				cssClass:'action-close',
				subTitle:"Your current profile status is  <strong class=Pending>“" +  this.karigar.status +"”</strong>. You can only send redeem request when your profile status is <strong class=Verified>“Verified”</strong>. To know more, you can call us at <a href=tel:9988802488>+91 9988802488</a>",
				buttons: [
					{
						text: 'Okay',
						handler: () => {
						}
					}
				]
			});
			alert.present();  
			return
		}
		
		else if(this.total_balance >= this.gift_detail.coupon_points  == false){
			const toast = this.toastCtrl.create({
				message: 'Insufficient points in your wallet',
				duration: 3000
			  });
			  toast.present();
			return
		}
		else{
			let contactModal = this.modalCtrl.create(CancelpolicyModalPage,{'karigar_id':this.dbService.userStorageData.id, 'type':this.gift_detail.type, 'gift_id':this.gift_id});
			contactModal.present();
			console.log('otp');
		}


		
	}
	goOnOfferDetailPage(offer_id)
	{
		this.navCtrl.push(OffersPage,{'id':offer_id})
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


	
		rating(star)
		{
			this.dbService.presentLoading();
			console.log(star);
			this.dbService.onPostRequestDataFromApi({'star':star,'gift_id' :this.gift_id,'karigar_id':this.dbService.userStorageData.id,'offer_id':this.gift_detail.offer_id},'app_karigar/giftRating', this.dbService.rootUrl).subscribe(r=>{
				console.log(r);
				this.dbService.onDismissLoadingHandler()
				if(r)
				{
					this.getGiftDetail(this.gift_id)
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

				  if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) {

				      console.log(previuosView);
				      this.navCtrl.popToRoot();
				  }
			}

		  }
	}
