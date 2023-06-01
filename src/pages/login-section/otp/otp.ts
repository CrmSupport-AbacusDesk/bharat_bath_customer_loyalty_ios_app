import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ModalController, LoadingController, Events } from 'ionic-angular';
import { RegistrationPage } from '../registration/registration';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { TabsPage } from './../../../pages/tabs/tabs';
import { AboutusModalPage } from '../../aboutus-modal/aboutus-modal'
import { Storage } from '@ionic/storage';
import { MobileLoginPage } from '../mobile-login/mobile-login';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../../home/home';


@IonicPage()
@Component({
    selector: 'page-otp',
    templateUrl: 'otp.html',
})

export class OtpPage {
    
    data: any = {};
    form: any = {};
    
    smsOTP: any;
    loginType: any;
    
    mobileNo: any;
    counter: any = 30*60;
    lang:any='en';
    
    otpInputMaxTime: any = 30;
    isOtpValid: any;
    
    resendActiveClass:any = false;
    hidevalue:boolean = false;
    text:any;
    alert:any;
    ok:any;

    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public dbService:DbserviceProvider,
        public alertCtrl:AlertController,
        public modalCtrl: ModalController,
        private storage:Storage,
        public loadingCtrl:LoadingController,
        public translate:TranslateService,
        public event:Events) {
            this.lang = this.navParams.get("lang");
            console.log('====================================');
            console.log(this.lang);
            console.log('====================================');
            
        }
        
        ionViewDidLoad() {
            
            console.log('ionViewDidLoad OtpPage');
            this.mobileNo = this.navParams.get('mobile_no');
            
            this.smsOTP = this.navParams.get('otp');
            this.loginType = this.navParams.get('loginType');
            
            this.translate.setDefaultLang(this.lang);
            this.translate.use(this.lang);

            console.log(this.smsOTP);
            this.onManageTimeCounter();
        }
        
        
        onSubmitUserOtpHandler() {
            
            this.dbService.onShowLoadingHandler();
            
            this.dbService.onPostRequestDataFromApi({'mobile_no': this.mobileNo ,'mode' :'App'},'auth/login', this.dbService.rootUrl).subscribe( (result) => {
                
                console.log(result);
                this.dbService.onDismissLoadingHandler();
                
                if (result['status'] == 'NOT FOUND') {
                    
                    this.navCtrl.push(RegistrationPage, { mobile_no : this.mobileNo, loginType : this.loginType});
                    return;
                    
                } else if(result['status'] == 'ACCOUNT SUSPENDED'){
                    this.translate.get('Your Account has been suspended')
                    .subscribe(resp=>{
                        this.text = resp;
                    });
                    this.dbService.onShowMessageAlertHandler(this.alert,this.text, this.ok);
                    this.navCtrl.push(MobileLoginPage);
                    
                    return;
                    
                }   else if(result['status'] == 'SUCCESS') {
                    
                    result['user']['token'] = result['token'];
                    result['user']['loginType'] = 'CMS';
                    
                    this.storage.set('userStorageData', result['user']);
                    this.dbService.userStorageData = result['user'];
                    
                    if ( result['user'].status != 'Verified' ) {
                        
                        let contactModal = this.modalCtrl.create(AboutusModalPage,{lang:this.lang,});
                        contactModal.present();
                    }
                    
                    this.navCtrl.setRoot(HomePage,{lang:this.lang,});
                }
            });
        }
        
        
        onResendOtpHandler() {
            
            this.dbService.onShowLoadingHandler();
            this.otpInputMaxTime = 30;
            
            this.onStartOtpExpireTimer();
            
            if(this.counter == 0) {
                
                this.counter = 30*60;;
                this.onManageTimeCounter();
            }
            
            this.form.mobile_no = this.mobileNo;
            this.form.otp = this.smsOTP;
            
            this.dbService.onPostRequestDataFromApi({ login_data: this.form },'app_karigar/karigarLoginOtp_new', this.dbService.rootUrl).subscribe((r) => {
                
                console.log(r);
                
                if (r['status'] == 'SUCCESS')  {

                    this.translate.get('Success!')
                    .subscribe(resp=>{
                        this.alert = resp;
                    })

                    this.translate.get('OTP has been sent')
                    .subscribe(resp=>{
                        this.text = resp;
                    })
                    
                    this.dbService.onShowMessageAlertHandler(this.alert,this.text, this.ok);
                    this.smsOTP = r['otp'];
                }
                
                this.dbService.onDismissLoadingHandler();
                
            }, err => {
                
                this.dbService.onDismissLoadingHandler();
                this.translate.get('Oops!')
                .subscribe(resp=>{
                    this.alert = resp;
                })
                this.translate.get('Something went wrong please try again')
                .subscribe(resp=>{
                    this.text = resp;
                })

                this.dbService.onDismissLoadingHandler();
                this.dbService.onShowMessageAlertHandler(this.alert,this.text, this.ok);

            });
            
            this.resendActiveClass = true;
            
            setTimeout(() => {
                
                this.resendActiveClass=false;
                
            }, 30000);
            
        }
        
        
        onManageTimeCounter() {
            
            const countDown = Observable.timer(0, 1000).take(this.counter).map(() => {
                
                --this.counter;
                if(this.counter == 0) {
                    
                    this.smsOTP = Math.floor(100000 + Math.random() * 900000);
                }
            })
        }
        
        onStartOtpExpireTimer() {
            
            const timer = setTimeout((x) => {
                
                this.otpInputMaxTime -= 1;
                
                if(this.otpInputMaxTime > 0) {
                    
                    this.hidevalue = true;
                    this.onStartOtpExpireTimer();
                    
                } else {
                    
                    this.otpInputMaxTime = 30;
                    this.hidevalue = false;
                }
                
            }, 1000);
        }
        
        
        onValidateUserOtpHandler() {
            
            if (this.data.otp == this.smsOTP) {
                
                this.isOtpValid = true;
                
            } else {
                
                this.isOtpValid = false;
            }
        }
        
        
        onBackButtonClickHanlder() {
            
            this.navCtrl.push(MobileLoginPage);
        }
        
    }
    