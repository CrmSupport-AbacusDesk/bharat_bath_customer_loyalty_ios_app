import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,ActionSheetController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TabsPage } from '../tabs/tabs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { TranslateService } from '@ngx-translate/core';

/**
* Generated class for the EditProfilePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  
  data:any={};
  karigar_id: any;
  state_list: any;
  district_list: any;
  district_list1: any;
  
  today_date:any;
  text:any;
  sucess:any;
  ok:any;
  please:any;
  share:any;
  dealers:any;
  
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dbService:DbserviceProvider,
    public alertCtrl:AlertController,
    public actionSheetController: ActionSheetController,
    public translate:TranslateService,
    private camera: Camera) {
      
      this.data = this.navParams.get('detail');
      console.log( this.data);
      
      this.today_date = new Date().toISOString().slice(0,10);
      console.log(this.data);
      
      this.getstatelist();
      this.getDistrictList(this.data.state);
      this.getDistrictList1(this.data.permanent_state);
      this.getDealerList(this.data.district);
      
      
      
      
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad EditProfilePage');
    }
    
    
    getstatelist()
    {
      this.dbService.onGetRequestDataFromApi('app_karigar/getStates', this.dbService.rootUrl).subscribe( r =>
        {
          console.log(r);
          this.state_list=r['states'];
          this.karigar_id=r['id'];
          console.log(this.state_list);
        });
      }
      
      getDistrictList(state_name)
      {
        console.log(state_name);
        this.dbService.onPostRequestDataFromApi({'state_name':state_name},'app_master/getDistrict', this.dbService.rootUrl).subscribe( r =>
          {
            console.log(r);
            this.district_list=r['districts'];
            console.log(this.state_list);
          });
        }

        getDealer_filterList(){
          if(this.data.district ){
            this.getDealerList(this.data.district);
          }
        }
        
  
        getDealerList(district)
        {
          console.log(district);
          this.dbService.onPostRequestDataFromApi({'district':district},'app_karigar/getDealers', this.dbService.rootUrl).subscribe( r =>
            {
              console.log(r);
              this.dealers=r['dealers'];
              // console.log(this.state_list);
            });
        }
        
        getDistrictList1(state_name)
        {
          console.log(state_name);
          this.dbService.onPostRequestDataFromApi({'state_name':state_name},'app_master/getDistrict', this.dbService.rootUrl).subscribe( r => {
            
            console.log(r);
            this.district_list1=r['districts'];
            console.log(this.state_list);
            
          });
        }
        
        onUploadChange(evt: any) {
          let actionsheet = this.actionSheetController.create({
            title:" Upload File",
            cssClass: 'cs-actionsheet',
            
            buttons:[{
              cssClass: 'sheet-m',
              text: 'Camera',
              icon:'camera',
              handler: () => {
                console.log("Camera Clicked");
                this.takeDocPhoto();
              }
            },
            {
              cssClass: 'sheet-m1',
              text: 'Gallery',
              icon:'image',
              handler: () => {
                console.log("Gallery Clicked");
                this.getDocImage();
              }
            },
            {
              cssClass: 'cs-cancel',
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        actionsheet.present();
      }
      
      takeDocPhoto()
      {
        console.log("i am in camera function");
        const options: CameraOptions = {
          quality: 70,
          destinationType: this.camera.DestinationType.DATA_URL,
          targetWidth : 500,
          targetHeight : 400
        }
        
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
          this.flag=false;
          this.data.document_image = 'data:image/jpeg;base64,' + imageData;
          console.log(this.data.document_image);
          
        }, (err) => {
        });
      }
      getDocImage()
      {
        const options: CameraOptions = {
          quality: 70,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          saveToPhotoAlbum:false
        }
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
          this.flag=false;
          this.data.document_image = 'data:image/jpeg;base64,' + imageData;
          console.log(this.data.document_image);
        }, (err) => {
        });
      }
      
      
      
      submit()
      {
        this.data.karigar_edit_id= this.data.id;
        this.dbService.onPostRequestDataFromApi( {'karigar':this.data },'app_karigar/addKarigar', this.dbService.rootUrl).subscribe( r =>
          {
            console.log(r);
            // if(r['status'] == 'EXIST')
            // {
            //   this.showAlert("Already EXIST!");
            //   return;
            
            // }
            
            this.showSuccess("Profile Updated Successfully!");
            this.navCtrl.setRoot(HomePage);
          },err=>{
            this.showSuccess("Profile Updated Successfully!");
            this.navCtrl.setRoot(ProfilePage);
            
          });
        }
        
        onCheckShippingAddressSameAsAddressHandler(event) {
          
          console.log(event);
          
          if (event.checked) {
            
            this.data.permanent_state = this.data.state;
            this.data.parmanent_district = this.data.district;
            this.data.permanent_pincode = this.data.pincode;
            this.data.permanent_city = this.data.city;
            this.data.permanent_address = this.data.address;
            this.getDistrictList1( this.data.permanent_state );
            
          } else {
            
            this.data.permanent_state = '';
            this.data.parmanent_district = '';
            this.data.permanent_pincode = '';
            this.data.permanent_city = '';
            this.data.permanent_address = '';
            
          }
        }
        
        MobileNumber(event: any) {
          const pattern = /[0-9]/;
          let inputChar = String.fromCharCode(event.charCode);
          if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
          }
        }
        
        caps_add(add:any)
        {
          this.data.address = add.replace(/\b\w/g, l => l.toUpperCase());
        }
        
        namecheck(event: any)
        {
          const pattern = /[A-Z\+\-\a-z ]/;
          let inputChar = String.fromCharCode(event.charCode);
          if (event.keyCode != 8 && !pattern.test(inputChar))
          {event.preventDefault(); }
        }
        
        showSuccess(text)
        {
          this.translate.get(text)
          .subscribe(resp=>{
            this.text = resp;
          })
          this.translate.get('Success!')
          .subscribe(resp=>{
            this.sucess = resp;
          })
          this.translate.get('OK')
          .subscribe(resp=>{
            this.ok = resp;
          })
          let alert = this.alertCtrl.create({
            title:this.sucess,
            subTitle: this.text,
            buttons: [this.ok]
          });
          alert.present();
        }
        
        showAlert(text) {
          
          let alert = this.alertCtrl.create({
            title:'Alert!',
            cssClass:'action-close',
            subTitle: text,
            buttons: ['OK']
          });
          
          alert.present();
        }
        
        flag:boolean = true;
        
        
        getaddress(pincode)
        {
          if(this.data.pincode.length=='6')
          {
            this.dbService.post_rqst({'pincode':pincode},'app_karigar/getAddress')
            .subscribe( (result) =>
            {
              console.log(result);
              var address = result.data;
              if(address!= null)
              {
                this.data.state = result.data.state_name;
                this.data.area = result.data.area;
                this.data.address = result.data.address;
                this.getDistrictList(this.data.state)
                this.data.district = result.data.district_name;
                this.data.city = result.data.city;
                console.log(this.data);
              }
            });
          }
          
        }
        permanentAddress(pincode)
        {
          console.log('funcation call');
          
          if(this.data.permanent_pincode.length=='6')
          {
            console.log('funcation call');
            
            this.dbService.post_rqst({'pincode':pincode},'app_karigar/getAddress')
            .subscribe( (result) =>
            {
              console.log(result);
              var address = result.data;
              if(address!= null)
              {
                this.data.permanent_state = result.data.state_name;
                this.getDistrictList1(this.data.permanent_state)
                this.data.parmanent_district = result.data.district_name;
                this.data.permanent_city = result.data.city;
                console.log(this.data);
              }
            });
          }
          
        }
      }
      