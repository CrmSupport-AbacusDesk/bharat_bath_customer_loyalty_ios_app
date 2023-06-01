import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { TabsPage } from '../../tabs/tabs';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HomePage } from '../../home/home';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment/moment';
@IonicPage()
@Component({
  selector: 'page-coupan-code',
  templateUrl: 'coupan-code.html',
})
export class CoupanCodePage {

  qr_code:any='';
  data:any={};
  flag:any='';
  alertMsg:any={};
  invalid:any;
  invalid1:any;
  ok:any;
  text:any;
  UNASSIGNED:any;
  USED:any;
  point_add:any;
  sucess:any;
  scan_more:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public alertCtrl:AlertController,
              private barcodeScanner: BarcodeScanner,
              public translate:TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoupanCodePage');
    
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
              //   role: 'cancel',
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

  submit(data)
  {
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
   
    this.flag=1;
    console.log(data);
    this.qr_code=data;
    this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'qr_code':this.qr_code},'app_karigar/karigarCoupon', this.dbService.rootUrl).subscribe((r:any)=>
    {
      console.log(r);

      if(r['status'] == 'BLANK'){
        this.showSecondAlert("This Coupon Code doesn't contain any Value");
        return;
      }
      else if(r['status'] == 'INVALID'){
        this.translate.get("Invalid Coupon Code")
        .subscribe(resp=>{
            this.showAlert('' , this.invalid1, `<img src="assets/imgs/cancel.gif"  alt="cancel"> <p>${this.invalid}</p>`);
        })
        return;
      }
      else if(r['status'] == 'REQUIRED'){
        this.showSecondAlert("Please Enter Coupon Code");
        return;
      }
      else if(r['status'] == 'USED'){
        this.alertMsg.scan_date=r['scan_date'];
        this.alertMsg.karigar_data=r.karigar_data;
        this.alertMsg.scan_date = moment(this.alertMsg.scan_date).format("D-M-Y");
        this.translate.get("Coupon Already Used")
        .subscribe(resp=>{
            console.log('====================================');
            console.log(resp);
            console.log('====================================');
            // this.showAlert(resp, 'USED', `<img src="assets/imgs/alert.gif"  alt="alert"> <p>This coupon has already been scanned. If you have any issue, feel free to chat with us! </p>`);
            this.showAlert( `<img src="assets/imgs/alert.gif"  alt="alert">`,this.USED+this.alertMsg.karigar_data.first_name+" ( "+this.alertMsg.karigar_data.mobile_no+" ) on " + this.alertMsg.scan_date,'' );

        })
        return;
      }
      else if(r['status'] == 'UNASSIGNED OFFER'){
        this.translate.get("Your Account Under Verification")
        .subscribe(resp=>{
            this.showAlert(resp, this.UNASSIGNED, `<img src="assets/imgs/alert.gif"  alt="alert">`);
            
        })
        return;
      }
      // this.showSuccess( r['coupon_value'] +" points has been added into your wallet")
      this.showSuccessPoint(`${r['coupon_value']}${this.point_add}`);
      // this.navCtrl.setRoot(HomePage);
    });
  }
  scan()
  {
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
    this.barcodeScanner.scan().then(resp => {
      console.log(resp);
      this.qr_code=resp.text;
      console.log( this.qr_code);
      if(resp.text != '')
      {
        this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'qr_code':this.qr_code},'app_karigar/karigarCoupon', this.dbService.rootUrl).subscribe((r:any)=>
        {
          console.log(r);

          if(r['status'] == 'INVALID'){
            this.translate.get("Invalid Coupon Code")
            .subscribe(resp=>{
                this.showAlert('' , this.invalid1, `<img src="assets/imgs/cancel.gif"  alt="cancel"> <p>${this.invalid}</p>`);
                setTimeout(() => {
                  this.scan(); 
              }, 3000);
            })
            return;
          }
          else if(r['status'] == 'USED'){
            this.alertMsg.scan_date=r.scan_date;
            this.alertMsg.karigar_data=r.karigar_data;
            this.alertMsg.scan_date = moment(this.alertMsg.scan_date).format("D-M-Y");
            this.translate.get("Coupon Already Used")
            .subscribe(resp=>{
                console.log('====================================');
                console.log(resp);
                console.log('====================================');
                // this.showAlert(resp, 'USED', `<img src="assets/imgs/alert.gif"  alt="alert"> <p>This coupon has already been scanned. If you have any issue, feel free to chat with us! </p>`);
                this.showAlert( `<img src="assets/imgs/alert.gif"  alt="alert">`,this.USED+this.alertMsg.karigar_data.first_name+" ( "+this.alertMsg.karigar_data.mobile_no+" ) on " + this.alertMsg.scan_date,'' );
                setTimeout(() => {
                  this.scan(); 
              }, 3000);

            })
            return;
          }
          else if(r['status'] == 'UNASSIGNED OFFER'){
            this.translate.get("Your Account Under Verification")
            .subscribe(resp=>{
                this.showAlert(resp, this.UNASSIGNED, `<img src="assets/imgs/alert.gif"  alt="alert">`);
                setTimeout(() => {
                  this.scan(); 
              }, 3000);
                
            })
            return;
          }
          else if(r['status'] == 'REQUIRED'){
            this.showSecondAlert("Please Enter the coupon code");
            return;
          }
          this.showSuccessPoint( `${r['coupon_value']}${this.point_add} `);});
          setTimeout(() => {
            this.scan(); 
        }, 3000);
      }
      else
      {
        console.log('not scanned anything');
      }
    });
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
  showSecondAlert(text){
    this.translate.get(text)
    .subscribe(resp=>{
        this.text = resp;
    })
    this.translate.get('OK')
    .subscribe(resp=>{
        this.ok = resp;
    })
    let alert = this.alertCtrl.create({
      // cssClass:'alert-alert',
      subTitle: this.text,
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
