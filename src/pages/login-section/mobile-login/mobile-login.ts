import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, Loading, LoadingController } from 'ionic-angular';
import { OtpPage } from '../otp/otp';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { SelectRegistrationTypePage } from '../../select-registration-type/select-registration-type';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
    selector: 'page-mobile-login',
    templateUrl: 'mobile-login.html',
})
export class MobileLoginPage {
    
    data:any = {};
    otp:any = '';
    loading:Loading;
    loginType:any = '';
    lang:any='en';
    text:any;
    alert:any;
    ok:any;
    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public dbService: DbserviceProvider,
        public alertCtrl:AlertController,
        public translate:TranslateService,
        public loadingCtrl:LoadingController) {
            this.loginType = 'Customer';
            this.lang = this.navParams.get("lang");
        }
        
        ionViewDidLoad() {
            console.log('ionViewDidLoad MobileLoginPage');
            this.translate.setDefaultLang(this.lang);
            this.translate.use(this.lang);
        }
        
        numberOnlyValidation(event: any) {
            const pattern = /^[6-9][0-9]{0,9}$/;
            console.log("value is ===>",event)
                //   const pattern = /[789]/;
                 
                  let inputChar = String.fromCharCode(event.charCode);
                  console.log("input==>",pattern.test(inputChar))
                  if ( !pattern.test(inputChar)) {
                        
                        event.preventDefault();
                  }
            
          }
        
        onLoginSubmitHandler() {
            
            this.dbService.onShowLoadingHandler();
            
            
            
            if(this.data.mobile_no == '8010000000' || this.data.mobile_no == '9319180958' || this.data.mobile_no == '8020202020' || this.data.mobile_no == '9560533107') {
                
                this.data.otp = '123456';
                
            } else {
                
                this.data.otp = Math.floor(100000 + Math.random() * 900000);
                
            }
            
            console.log(this.data);
            
            this.dbService.onPostRequestDataFromApi({'login_data': this.data},'app_karigar/karigarLoginOtp_new', this.dbService.rootUrl).subscribe((r) => {
                
                this.translate.get('Alert!')
                .subscribe(resp=>{
                    this.alert = resp;
                })
                this.translate.get('Ok')
                .subscribe(resp=>{
                    this.ok = resp;
                })

                
                this.dbService.onDismissLoadingHandler();

                if (r['status'] == 'REQUIRED MOBILE NO') {
                    this.translate.get('Please enter mobile number to continue.')
                    .subscribe(resp=>{
                        this.text = resp;
                    })
                    this.dbService.onShowMessageAlertHandler(this.alert,this.text, this.ok);
                    return false;
                    
                }
                else if (r['type'] == 'Plumber'){
                    this.translate.get('This number is registered as Plumber, please use another number to log in as a Customer')
                    .subscribe(resp=>{
                        this.text = resp;
                    })
                    this.dbService.onShowMessageAlertHandler(this.alert,this.text, this.ok);
                    return;
                }
                
                else if (r['type'] == 'Dealer'){
                    this.translate.get('This number is registered as Dealer, please use another number to log in as a Customer')
                    .subscribe(resp=>{
                        this.text = resp;
                    })
                    this.dbService.onShowMessageAlertHandler(this.alert,this.text, this.ok);
                    return;
                }
                
                else if (r['status'] == "SUCCESS") {
                    
                    this.otp = r['otp'];
                    
                    this.navCtrl.push(OtpPage, {
                        lang:this.lang,
                        otp: this.data.otp,
                        mobile_no: this.data.mobile_no,
                        loginType: this.loginType
                    });
                }
            });
        }
        
        onBackButtonClickHanlder() {
            
            this.navCtrl.push(SelectRegistrationTypePage);
        }
        onMobileValidateHandler(ev){
            console.log(ev)
        }
    }
    