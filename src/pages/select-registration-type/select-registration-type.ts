import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, Loading } from 'ionic-angular';
import { MobileLoginPage } from '../login-section/mobile-login/mobile-login';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { LanguagePage } from '../language/language';


/**
* Generated class for the SelectRegistrationTypePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
    selector: 'page-select-registration-type',
    templateUrl: 'select-registration-type.html',
})
export class SelectRegistrationTypePage {
    
    registerTypeList: any = [];
    data: any = [];
    lang:any='en';
    loading:Loading;
    
    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public translate:TranslateService,
        public storage: Storage) {
            this.data.registerType = '';
            this.lang = this.navParams.get("lang");
            console.log('====================================');
            console.log(this.lang);
            console.log('====================================');
        }
        
        ionViewDidLoad() {
            this.translate.setDefaultLang(this.lang);
            this.translate.use(this.lang);
        }
        
        goToRegisterPage() {
            
            console.log(this.data);
            
            if(this.data.registerType == 'Employee' || this.data.registerType == 'DrLogin') {
                
                this.navCtrl.push(LoginPage, { registerType : this.data.registerType, lang:this.lang});
                
            } else {
                
                this.navCtrl.push(MobileLoginPage, { registerType : this.data.registerType, lang:this.lang});
            }
        }
        
        
      


        onBackButtonClickHanlder() {
            this.navCtrl.push(LanguagePage);
        }
        
    }
    