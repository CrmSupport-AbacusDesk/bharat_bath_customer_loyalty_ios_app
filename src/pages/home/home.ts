import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, AlertController, ModalController, Events, NavParams, ToastController } from 'ionic-angular';
import { ScanPage } from '../scane-pages/scan/scan';
import { OfferListPage } from '../offer-list/offer-list';
import { PointListPage } from '../points/point-list/point-list';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OffersPage } from '../offers/offers';
import { Storage } from '@ionic/storage';
import * as moment from 'moment/moment';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { GiftListPage } from '../gift-gallery/gift-list/gift-list';
import { ViewProfilePage } from '../view-profile/view-profile';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { CoupanCodePage } from '../scane-pages/coupan-code/coupan-code';
import { CategoryPage } from '../category/category';
import { AddNewComplaintPage } from '../complaints/add-new-complaint/add-new-complaint';
import { ComplaintHistoryPage } from '../complaints/complaint-history/complaint-history';
import { MyCamplaintsPage } from '../plumber-camplaints/my-camplaints/my-camplaints';
import { ComplaintDetailPage } from '../complaints/complaint-detail/complaint-detail';
import { NewarrivalsPage } from '../newarrivals/newarrivals';
import { NearestDealerPage } from '../nearest-dealer/nearest-dealer';

import { SocialSharing } from '@ionic-native/social-sharing';

import { SQLite } from '@ionic-native/sqlite/ngx/index';
// import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FavoriteProductPage } from '../favorite-product/favorite-product';
import { VideoPage } from '../video/video';
import { PlumberCheckinPage } from '../plumber-checkin/plumber-checkin';
import { RetailerAddComplaintPage } from '../retailer-add-complaint/retailer-add-complaint';
import { RetailerListComplaintPage } from '../retailer-list-complaint/retailer-list-complaint';
import { SurveyListPage } from '../survey/survey-list/survey-list';
import { TranslateService } from '@ngx-translate/core';
import { ContactPage } from '../contact/contact';
import { AboutPage } from '../about/about';
import { VideoCategoryPage } from '../video-category/video-category';
import { Super30Page } from '../super30/super30';
import { ProfilePage } from '../profile/profile';
import { HotsellingPage } from '../hotselling/hotselling';
import { DealerDealerListPage } from '../dealer-dealer-list/dealer-dealer-list';



// import { CallNumber } from '@ionic-native/call-number';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    [x: string]: any;
    offer_list:any=[];
    prodCount:any={};
    
    loading:Loading;
    karigar_detail:any={};
    last_point:any='';
    today_point:any='';
    qr_code:any='';
    coupon_value:any='';
    product_count:any='';
    complaint_count:any='';
    plumber_complaint:any='';
    plumber_installation:any='';
    hide_slider:boolean=true;
    
    
    constructor(public toastCtrl: ToastController,
        public socialSharing:SocialSharing ,
        public navCtrl: NavController,
        public nav:NavParams,
        public dbService:DbserviceProvider,
        public loadingCtrl:LoadingController,
        public storage:Storage,
        private barcodeScanner: BarcodeScanner,
        public alertCtrl:AlertController,
        public modalCtrl: ModalController,
        private push: Push ,
        public events: Events,
        private sqlite: SQLite,
        // public offlineService: OfflineDbProvider,
        public translate :TranslateService,
        public fileTransfer: FileTransfer,
        public file: File) {
            
            this.bannerURL = this.dbService.upload_url3
            this.lang = this.nav.get("lang");
            if(this.lang){
                this.updateLang();
            }
            this.loginBanner();
            // this.notification();
            this.get_countWithLiveServer()
            // this.onCheckAppCurrentVersionHandler()
            events.subscribe('getCountProducts',(data)=>
            {
                this.get_count();
            })
            
            if(this.dbService.connection != 'offline')
            {
                this.get_count();
            }
        }
        
        showSuccessPoint(text)
        {
            this.translate.get(text)
            .subscribe(resp=>{
                this.text = resp;
            })
            this.translate.get('Success!')
            .subscribe(resp=>{
                this.sucess = resp;
            })
            this.translate.get('Scan More')
            .subscribe(resp=>{
                this.scan_more = resp;
            })
            this.translate.get('Ok')
            .subscribe(resp=>{
                this.ok = resp;
            })
            let alert = this.alertCtrl.create({
                title: this.sucess,
                cssClass:'sucess-alert',
                message: `<img src="assets/imgs/sucess.gif"  alt="sucess">`,
                subTitle: this.text,
                buttons: [ {
                    text: this.scan_more,
                    handler: () => {
                        this.scan();
                    }
                },
                {
                    text: this.ok,
                    handler: () => {
                        
                    }
                }
            ]
            
            
        });
        alert.present();
    }
    
    ionViewWillEnter()
    {
        
        this.get_count();
        console.log('ionViewDidLoad HomePage');
        if(this.dbService.connection != 'offline')
        {
            this.getData();
            this.getofferBannerList();
            
            console.log('Hello its calling');
            // this.notification();
            this.onProcessSQLDataHandler();
            
        }
    }
    
    goToNewArrivals()
    {
        // console.log('newArrivals')
        if(this.dbService.connection=='offline')
        {
            let toast = this.toastCtrl.create({
                message: 'You Are Offline .. You May Miss The Updates!',
                duration: 3000
            });
            toast.present();
        }
        this.navCtrl.push(NewarrivalsPage);
        // else
        // {
        // this.navCtrl.push(NewarrivalsPage);
        
        // }
    }
    goOnPointListPage()
    {
        // console.log('Begin async operation', refresher);
        this.get_count()
        this.getofferBannerList()
        
        this.getData();
        // refresher.complete();
    }
    
    
    
    getData()
    {
        this.dbService.presentLoading();
        // this.loading.present
        console.log("Check");
        this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id},'app_karigar/karigarHome', this.dbService.rootUrl)
        .subscribe((r:any)=>
        {
            console.log(r);
            this.dbService.onDismissLoadingHandler();
            this.karigar_detail=r['karigar'];
            this.rank = r.rank;
            this.total_balance=r['karigar'].total_balance;
            this.last_point=r['last_point'];
            this.today_point=r['today_point'];
            this.lang =   this.karigar_detail.language;
            this.translate.use(this.lang);
            
        },() => {
            this.dbService.onDismissLoadingHandler();
        });
    }
    updateLang()
    {
        
        console.log("Check");
        this.karigar_detail.language = this.lang;
        this.karigar_detail.id = this.dbService.userStorageData.id;
        this.dbService.onPostRequestDataFromApi({"data":this.karigar_detail},'app_karigar/update_language', this.dbService.rootUrl)
        .subscribe((r:any)=>
        {
            console.log(r);
            this.dbService.onDismissLoadingHandler();
            
        },() => {
            this.dbService.onDismissLoadingHandler();
        });
    }
    installation_count:any='';
    complaint_exist:any=false;
    open_complaint:any={};
    
    get_count()
    {
        // this.offlineService.onReturnActiveProductCountHandler().subscribe(productCount => {
        
        //     console.log(productCount);
        
        //     this.product_count = productCount;
        //     // this.complaint_count = 0;
        //     // this.installation_count = 0;
        //     // this.complaint_exist = 0;
        //     // this.open_complaint = 0;
        //     // this.plumber_complaint = 0;
        //     // this.plumber_installation = 0;
        //     console.log(this.product_count);
        // });
        
        
        // this.offlineService.onReturnActiveProductNewArrivalsCountHandler().subscribe(productCount1 => {
        
        //      this.prodCount.new= productCount1
        
        // },  err =>
        // {
        
        // });
        
        console.log(this.prodCount);
    }
    
    
    get_countWithLiveServer()
    {
        this.dbService.onPostRequestDataFromApi({'customer_id':this.dbService.userStorageData.id},'app_master/product_catalogue_count', this.dbService.rootUrl)
        .subscribe((result:any)=> {
            
            console.log(result);
            this.product_count = result['master_product'];
            this.complaint_count = result['complaint'];
            this.installation_count = result['installation'];
            this.complaint_exist = result['complaint_exist'];
            this.open_complaint = result['open_complaint'];
            this.plumber_complaint = result['plumber'];
            this.plumber_installation = result['plumberInstallation'];
            console.log(this.product_count);
        });
        
    }
    scanCoupon() {
        console.log(this.karigar_detail.status);
        
        
        if(this.karigar_detail.status != 'Verified'){
            let alert = this.alertCtrl.create({
                title:'Sorry!',
                cssClass:'action-close',
                subTitle:"Your current profile status is  <strong class=Pending>“" +  this.karigar_detail.status +"”</strong>. You can only scan the coupon codes when your profile status is <strong class=Verified>“Verified”</strong>. To know more, you can call us at <a href=tel:9988802488>+91 9988802488</a>",
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
        else{
            let alert = this.alertCtrl.create();
            this.translate.get("Coupon")
            .subscribe(resp=>{
                this.coupon_lang = resp;
            })
            
            this.translate.get("Coupon Scan")
            .subscribe(resp=>{
                this.CouponScan = resp;
            })
            this.translate.get("Enter Coupon Code")
            .subscribe(resp=>{
                this.enter_coupon_code = resp;
            })
            this.translate.get("Cancel")
            .subscribe(resp=>{
                this.Cancel = resp;
            })
            this.translate.get("OK")
            .subscribe(resp=>{
                this.OK = resp;
            })
            alert.setTitle(this.coupon_lang);
            
            alert.addInput({
                type: 'radio',
                label: this.CouponScan,
                value: 'scan',
                checked: true
            });
            alert.addInput({
                type: 'radio',
                label: this.enter_coupon_code,
                value: 'code',
                
            });
            
            alert.addButton(this.Cancel);
            alert.addButton({
                text: this.OK,
                handler: data => {
                    this.testRadioOpen = false;
                    // this.testRadioResult = data;
                    this.value = data;
                    if(this.value == 'scan'){
                        this.scan();
                    }else if(this.value == 'code'){
                        this.navCtrl.push(CoupanCodePage)
                    }
                    
                }
            });
            alert.present();
        }
        
        
        
    }
    alertMsg:any={};
    getofferBannerList()
    {
        console.log(this.dbService.userStorageData.id);
        console.log('offerbanner');
        this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id},'app_karigar/offerList', this.dbService.rootUrl).subscribe(r=>
            {
                console.log(r);
                this.offer_list=r['offer'];
                console.log(this.offer_list);
            });
        }
        
        conInt(val)
        {
            return parseInt(val);
        }
        scan() {
            this.translate.get("Oops! You have scanned an incorrect product code. This may not be a valid QR code.")
            .subscribe(resp=>{
                this.invalid = resp;
            })
            this.translate.get("INVALID")
            .subscribe(resp=>{
                this.invalid1 = resp;
            })
            this.translate.get("Coupon Already Used By")
            .subscribe(resp=>{
                this.USED = resp;
            })
            this.translate.get("points has been added into your wallet")
            .subscribe(resp=>{
                this.point_add = resp;
            })
            
            if(this.karigar_detail.status !='Verified'){
                this.showAlert('','',"Your status is not verified can not scan coupon");
                return;
            }
            
            else if( this.karigar_detail.manual_permission==1)
            {
                this.navCtrl.push(CoupanCodePage)
            }
            else
            {
                console.log('0');
                
                this.barcodeScanner.scan().then(resp => {
                    console.log(resp);
                    this.qr_code=resp.text;
                    console.log( this.qr_code);
                    if(resp.text != '')
                    {
                        this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'qr_code':this.qr_code},'app_karigar/karigarCoupon', this.dbService.rootUrl)
                        .subscribe((r:any)=>
                        {
                            console.log(r);
                            
                            if(r['status'] == 'INVALID'){
                                this.translate.get("Invalid Coupon Code")
                                .subscribe(resp=>{
                                    this.showAlert('' , this.invalid1, `<img src="assets/imgs/cancel.gif"  alt="cancel"> <p>${this.invalid}</p>`);
                                    setTimeout(() => {
                                        this.scan(); 
                                    }, 2000);
                                    
                                })
                                return;
                            }
                            else if(r['status'] == 'USED'){
                                this.alertMsg.scan_date=r.scan_date;
                                this.alertMsg.karigar_data=r.karigar_data;
                                this.alertMsg.scan_date = moment(this.alertMsg.scan_date).format("D-M-Y");
                                this.translate.get("Coupon Already Used")
                                .subscribe(resp=>{
                                    this.showAlert( `<img src="assets/imgs/alert.gif"  alt="alert">`,this.USED+this.alertMsg.karigar_data.first_name+" ( "+this.alertMsg.karigar_data.mobile_no+" ) on " + this.alertMsg.scan_date,'' );
                                    setTimeout(() => {
                                        this.scan(); 
                                    }, 2000);
                                    
                                })
                                return;
                            }
                            else if(r['status'] == 'UNASSIGNED OFFER'){
                                this.translate.get("Your Account Under Verification")
                                .subscribe(resp=>{
                                    this.showAlert(resp, this.UNASSIGNED, `<img src="assets/imgs/alert.gif"  alt="alert">`);
                                    setTimeout(() => {
                                        this.scan(); 
                                    }, 2000);
                                    
                                })
                                return;
                            }
                            else if(r['status'] == 'REQUIRED'){
                                this.showSecondAlert("Please Enter the coupon code");
                                return;
                            }
                            
                            else if(r['status'] == 'VALID'){
                                this.translate.get(" point  have been added into your wallet")
                                .subscribe(resp=>{
                                    this.showSuccess( r['coupon_value'] + ' ' + resp);

                                    setTimeout(() => {
                                        this.scan(); 
                                    }, 2000);
                                })
                                
                            }
                            
                        });
                    }
                    else
                    {
                        console.log('not scanned anything');
                    }
                });
            }
            
            
            
            
        }
        viewProfiePic()
        {
            this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.profile}).present();
        }
        
        
        goOnScanePage(){
            if(this.dbService.connection=='offline')
            {
                
            }
            else
            {
                this.navCtrl.push(ScanPage);
            }
        }
        
        goOnOffersListPage(){
            if(this.dbService.connection=='offline')
            {
                
            }
            else
            {
                this.navCtrl.push(OfferListPage);
            }
            
        }
        goOnOffersPage(id)
        {
            if(this.dbService.connection=='offline')
            {
                
                
            }
            else
            {
                this.navCtrl.push(OffersPage,{'id':id});
            }
        }
        
        goOnPointeListPage(){
            if(this.dbService.connection=='offline')
            {
                
                
            }
            else
            {
                this.navCtrl.push(PointListPage);
            }
            
        }
        
        showAlertComingSoon(text)
        {
            this.translate.get("OK")
            .subscribe(resp=>{
                this.ok = resp;
            })
            
            let alert = this.alertCtrl.create({
                title:text,
                cssClass:'alert-alert',
                
                buttons: [
                    {
                        // text: 'Chat With Us',
                        //   role: 'cancel',
                        handler: () => {
                            // this.helpChat();
                        }
                    },
                    {
                        text: this.ok,
                        handler: () => {
                            
                        }
                    }
                ]
                // buttons: ['OK']
            });
            alert.present();
        }

        
        goOnMyCamplaintsPage(type)
        {
            this.navCtrl.push(MyCamplaintsPage,{type:type});
        }
        
        goOnGiftListPage()
        {
            if(this.dbService.connection=='offline')
            {
                
            }
            else
            {
                this.navCtrl.push(GiftListPage,{'mode':'home'});
            }
        }
        
        // goToNewArrivals()
        // {
        //     // console.log('newArrivals')
        //     if(this.service.connection=='offline')
        //     {
        //         let toast = this.toastCtrl.create({
        //             message: 'You Are Offline .. You May Miss The Updates!',
        //             duration: 3000
        //         });
        //         toast.present();
        //     }
        //     // else
        //     // {
        //     this.navCtrl.push(NewarrivalsPage);
        //     // }
        // }
        // goOnPointListPage()
        // {
        //     if(this.service.connection=='offline')
        //     {
        //         this.service.showOfflineAlert()
        //     }
        //     else
        //     {
        //         this.navCtrl.push(PointListPage,{'mode':'home'});
        //     }
        // }
        // goOnProductPage()
        // {
        //    this.navCtrl.push(ProductsPage,{'mode':'home'});
        
        // }
        goOnProductPage()
        {
            // if(this.dbService.connection=='offline')
            // {
            //     let toast = this.toastCtrl.create({
            //         message: 'You Are Offline .. You May Miss The Updates!',
            //         duration: 3000
            //     });
            //     toast.present();
            // }
            
            this.navCtrl.push(CategoryPage,{'mode':'home'});
        }
        goOnComplaintAdd(type)
        {
            console.log(type);
            if(this.dbService.connection=='offline')
            {
                
                
            }
            else
            {
                this.navCtrl.push(AddNewComplaintPage,{'mode':'home',type:type});
            }
            
        }
        
        goOnOpenComplaintAdd()
        {
            
            if(this.dbService.connection=='offline')
            {
                
                
            }
            else
            {
                this.navCtrl.push(ComplaintDetailPage,{'id':this.open_complaint.id});
            }
            
        }
        
        
        // <<<<<<< HEAD
        //       }).catch((e) => {
        //         console.log(e);
        //       });
        //     }
        
        
        banner:any=[]
        // loginBanner(){
        //     console.log('called');
        
        //     this.service.post_rqst( '', 'app_karigar/loginBannersApp' )
        //     .subscribe(d => {
        //         console.log(d);
        
        //         this.banner = d.banner;
        //         console.log(this.banner);
        //     });
        // =======
        complaintHistory(type:any)
        {
            // alert('test');
            // console.log(type + 'test');
            if(this.dbService.connection=='offline')
            {
                
                
            }
            else
            {
                this.navCtrl.push(ComplaintHistoryPage,{'mode':'home',type:type});
            }
            
        }
        
        showAlert(text, alertTilte, img )
        {
            this.translate.get("OK")
            .subscribe(resp=>{
                this.ok = resp;
            })
            
            let alert = this.alertCtrl.create({
                title:alertTilte,
                cssClass:'alert-alert',
                message: img,
                subTitle: text,
                buttons: [
                    {
                        // text: 'Chat With Us',
                        //   role: 'cancel',
                        handler: () => {
                            // this.helpChat();
                        }
                    },
                    {
                        text: this.ok,
                        handler: () => {
                            
                        }
                    }
                ]
                // buttons: ['OK']
            });
            alert.present();
        }
        // helpChat(){
        //     this.navCtrl.push()
        // }
        goToNearestDealers(type)
        {
            console.log(this.karigar_detail.pincode);
            if(this.dbService.connection=='offline')
            {
                
                
            }
            else
            {
                
                this.navCtrl.push(NearestDealerPage,{pincode:this.karigar_detail.pincode,type:type});
                
            }
            
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
        
        notification()
        {
            console.log("notification");
            
            this.push.hasPermission()
            .then((res: any) => {
                
                if (res.isEnabled) {
                    console.log('We have permission to send push notifications');
                } else {
                    console.log('We do not have permission to send push notifications');
                }
            });
            
            
            const options: PushOptions = {
                android: {
                    senderID:'588971704584'
                },
                ios: {
                    
                    alert: 'true',
                    badge: true,
                    sound: true
                },
                windows: {},
                browser: {
                    pushServiceURL: 'http://push.api.phonegap.com/v1/push'
                }
            };
            
            const pushObject: PushObject = this.push.init(options);
            pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
            pushObject.on('registration').subscribe((registration: any) => {
                console.log('Device registered', registration)
                this.dbService.onPostRequestDataFromApi({'id':this.dbService.userStorageData.id,'registration_id':registration.registrationId},'app_karigar/update_token', this.dbService.rootUrl).subscribe(r=>
                    {
                        console.log(r);
                    });
                }
                );
                
                pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
            }
            
            logout()
            {
                
                
                let alert = this.alertCtrl.create({
                    title: 'Logout!',
                    message: 'Are you sure you want Logout?',
                    buttons: [
                        {
                            text: 'No',
                            handler: () => {
                                console.log('Cancel clicked');
                                // this.d.('Action Cancelled!')
                            }
                        },
                        {
                            text: 'Yes',
                            handler: () => {
                                //   this.itemsArr.splice(i,1);
                                
                                console.log('logout');
                                this.storage.set('userStorageData', {});
                                this.dbService.userStorageData = {};
                                
                            }
                        }
                    ]
                })
                
                alert.present();
                
            }
            
            ref_code:any="";
            ShareApp()
            {
                // alert('hello')
                console.log(this.karigar_detail);
                if(this.karigar_detail.type == "Plumber" && this.karigar_detail.referral_code!="")
                {
                    this.ref_code = ' and use my Code *'+this.karigar_detail.referral_code+'* to get points back in your wallet'
                }
                this.socialSharing.share('Hey There ! here is an awesome app from BIUT  ..Give it a try https://apps.apple.com/us/app/biut/id6443536662'+this.ref_code).then(() => {
                
                console.log("success");
            }).catch((e) => {
                console.log(e);
            });
        }
        
        
        
        onCheckAppCurrentVersionHandler()  {
            
            this.dbService.onPostRequestDataFromApi('', 'app_karigar/app_version', this.dbService.rootUrl).subscribe(resp => {
                
                console.log(resp);
                this.playStoreAppVersion = resp['app_version'];
                
                this.appVersion.getVersionNumber().then(resp => {
                    
                    console.log(resp);
                    this.mobileAppVersion = resp;
                    console.log("mobile app version ======>")
                    console.log(this.mobileAppVersion );
                    
                    console.log("mobile app version ======>")
                    
                    console.log(" this.playStoreAppVersion======>")
                    console.log(this.playStoreAppVersion );
                    
                    console.log(" this.playStoreAppVersion ======>")
                    
                    if (this.mobileAppVersion != this.playStoreAppVersion) {
                        
                        let updateAlert = this.alertCtrl.create({
                            
                            title: 'Update Available',
                            message: 'A newer version of this app is available for download. Please update it from PlayStore !',
                            buttons: [
                                {
                                    text: 'Cancel',
                                },
                                {
                                    text: 'Update Now',
                                    handler: () => {
                                        window.open('https://play.google.com/store/apps/details?id=com.bharatbathroom.app&hl=en','_system','location=yes');
                                    }
                                    
                                }
                            ]
                        });
                        
                        updateAlert.present();
                    }
                    
                    console.log("version");
                    
                });
            });
        }
        
        
        
        goToFav()
        {
            this.navCtrl.push(FavoriteProductPage)
        }
        
        loginBanner(){
            console.log('called');
            
            this.dbService.onPostRequestDataFromApi(  {'karigar_id':this.dbService.userStorageData.id}, 'app_karigar/loginBannersApp' , this.dbService.rootUrl)
            .subscribe(d => {
                console.log(d);
                
                this.banner = d.banner;
                if(this.banner.length == 1){
                    this.hide_slider = false;
                    
                    console.log("bannerlength ===>",this.banner.length)
                }
                for(let i=0;i<=this.banner.length;i++) {
                    this.element = this.banner[i];
                    console.log("present is ===>",this.element)
                    
                }
                //         console.log(this.banner);
                
                //         this.avatars = this.banner.map((x, i) => {
                //           const num = i;
                //           return {
                //             url: this.db.myurl+'app/uploads/'+x.banner,
                //             title: ''
                //           };
                //         });
                
                // console.log(  this.avatars);
                
                
            });
        }
        doRefresh (refresher)
        {
            if(this.dbService.connection != 'offline')
            {
                this.get_count();
            }
            this.get_countWithLiveServer();
            this.getData();
            this.getofferBannerList();
            this.loginBanner();
            setTimeout(() => {
                refresher.complete();
            }, 1000);
        }
        
        goToVideosPage(cat) {
            
            console.log(cat);
            this.navCtrl.push(VideoPage,{cat:cat});
        }
        
        walletPage(){
            this.navCtrl.push(PointListPage);
        }
        offerPage(){
            this.navCtrl.push(OfferListPage)
        }
        
        aboutPage(){
            this.navCtrl.push(AboutPage);
        }
        
        
        contactPage(){
            this.navCtrl.push(ContactPage);
        }
        
        goOnVideoPage(){
            this.navCtrl.push(VideoCategoryPage);
        }

        
        goOnDealer(){
            this.navCtrl.push(DealerDealerListPage);
        }
        
        goOnProductsPage(){
            this.navCtrl.push(CategoryPage);
        }
        
        Super30Page(){
            this.navCtrl.push(Super30Page);
        }
        
        profile(){
            this.navCtrl.push(ProfilePage)
        }
        
        
        
        checkin(){
            this.showAlertComingSoon('Coming Soon....')
            return;
            
            
            // if(this.karigar_detail.status =='Pending'){
            //     // alert("You Are Not Verified!!");
            //     this.showAlert('','',"You Are Not verified");
            // }else{
            //     this.navCtrl.push(PlumberCheckinPage)
            // }
            
        }
        add(){
            this.navCtrl.push(RetailerAddComplaintPage)
        }
        list(){
            this.navCtrl.push(RetailerListComplaintPage)
        }
        SurveyList(){
            this.navCtrl.push(SurveyListPage)
        }
        
    }
    