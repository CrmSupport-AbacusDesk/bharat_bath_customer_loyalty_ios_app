import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { EnquiryPage } from '../enquiry/enquiry';
import { SocialSharing } from '@ionic-native/social-sharing';
// import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
// import { SQLite } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
    selector: 'page-product-subdetail',
    templateUrl: 'product-subdetail.html',
})
export class ProductSubdetailPage {
    prod_id:any='';
    api:any;
    prod_detail:any={};
    productImg:any =[];
    loading:Loading;
    prod_image:any=[];
    active_image:any=''
    user_data:any={};
    userType:any
    company_name:any='BIUT'
    url:any=''
    data:any ={};
    randomProduct:any =[];
    video_link:any;
    
    
    constructor(public socialSharing:SocialSharing,
        public storage: Storage,
        public navCtrl: NavController,
        public navParams: NavParams,
        public dbService:DbserviceProvider,
        public loadingCtrl:LoadingController,
        private app:App,
        public dom:DomSanitizer,
        // public offlineService: OfflineDbProvider,
        // private sqlite: SQLite
        ) {
            this.url = this.dbService.product_img_url;
            const loginType = this.dbService.userStorageData.loginType;
            
            console.log(loginType);
            if(loginType=='CMS')
            {
                this.userType='notDrLogin'
            }
            else
            {
                this.userType='drLogin'
            }
            
            console.log(this.userType);
            
            if(this.userType=='CMS')
            {
                this.user_data = this.dbService.userStorageData;
            }
            else
            {
                this.user_data = this.dbService.userStorageData.all_data;
            }
            console.log(this.user_data);
            this.dbService.presentLoading();
            
        }
        
        ionViewDidLoad() {
            console.log('ionViewDidLoad ProductSubdetailPage');
            this.data  = this.navParams.data;
            
            this.prod_id = this.navParams.get('id');
            this.getProductDetail(this.prod_id);
            
        }
        openLink(Link)
        {
            window.open(Link,'_system','location=yes');
            
        }
        
        
        
        getProductDetail(id)
        {
            
            this.dbService.onPostRequestDataFromApi({'product_id' :id},'app_master/productDetail', this.dbService.rootUrl).subscribe( r =>
                {
                    console.log(r);
                    
                    this.dbService.onDismissLoadingHandler();
                    this.prod_detail=r['product'];
                    this.productImg= this.prod_detail.image;
                    
                    this.randomProduct=r['random_product'];
                    
                    // this.video_link = this.dom.bypassSecurityTrustResourceUrl(r['video'])
                    this.prod_image=r['product']['image'];
                });
            }
            
            imgData:any;
            
            
            shareproduct(id)   {
                let img =  this.productImg.filter(x => x.id==id)[0];
                this.imgData = this.url + img.actual_image_name
                var shareData
                let app_url = "https://apps.apple.com/us/app/biut/id6443536662"
                shareData = "Company Name : "+this.company_name+"\n"+"Product Name :  "+this.prod_detail.product_name+ "\n"+"Product Code : "+this.prod_detail.material_code+"\n"+"MRP : "+"Rs. "+this.prod_detail.price+ "\n"+ app_url;               
                this.socialSharing.share(shareData,null,this.imgData,null).then(() => {
                }).catch((e) => {
                });
            }
            
            
            
            ionViewDidLeave()
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
            
            prod_data:any={};
            
        }
        