import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, LoadingController, Loading, ModalController, ToastController  } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TabsPage } from '../tabs/tabs';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { HomePage } from '../home/home';

declare var google;


@IonicPage()
@Component({
  selector: 'page-task-close',
  templateUrl: 'task-close.html',
})
export class TaskClosePage {
  status:any={};
  loading:Loading;
  today_date:any;
  complaint_id;
  customerMobileNo;
  lable;
  new_lat:any;
  comType:any = '';
  new_long:any;
  
  constructor(public dbService:DbserviceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl:AlertController ,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    private loadingCtrl:LoadingController,
    private transfer: FileTransfer,
    public modalCtrl: ModalController,
    private storage:Storage, public locationAccuracy: LocationAccuracy,
    public geolocation: Geolocation,
    public toastCtrl:ToastController) {
      
      // this.data.gender="male";
      this.today_date = new Date().toISOString().slice(0,10);
      this.status.complaints_id = this.navParams.get('id');
      this.customerMobileNo = this.navParams.get('mobile');
      this.status.name = this.navParams.get('name');
      this.lable = this.navParams.get('lable');
      console.log(this.lable);
      
      
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad TaskClosePage');
      this.loadMap();
    }
    
    
    loadMap() {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(() => {
        let options = {
          maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
        };
        this.geolocation.getCurrentPosition().then((resp) => {
          let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          
          
          this.new_lat=resp.coords.latitude;
          this.new_long=resp.coords.longitude;
          
          console.log(latLng);
          
          // this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
          
          // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          // this.addMarker(this.map);
          
        })
        .catch((error) => {
          // this.dbService.presentToast('Error getting location')
          
        })
      },
      error => {
        console.log('Error requesting location permissions', error);
        let toast = this.toastCtrl.create({
          message: 'Allow Location Permissions',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      });
      
    }
    
    
    
    submit()
    {
      this.dbService.presentLoading()
      this.status.closed_by = this.dbService.userStorageData.id;
      this.status.status=this.lable;
      this.dbService.onPostRequestDataFromApi({'status' : this.status},'app_karigar/complaintTaskCloseByPlumber', this.dbService.rootUrl).subscribe( r =>
        {
          console.log(r);
          this.dbService.onDismissLoadingHandler();
          
          if(r['status'] == 'success')
          {
            if(this.lable=='Closed')
            {
              this.showSuccess("Complaint Closed Successfully ");
              
            }
            else
            {
              this.showSuccess("Remark Added Successfully ");
              
            }
            this.navCtrl.setRoot(HomePage);
            this.checkOut(this.status.complaints_id, this.lable, this.status.remark);
            // this.navCtrl.push( PulmberCustomerDetailPage,{'id':this.status.complaints_id});
          }
          else if(r['status'] == 'Otp not matched.')
          {
            this.showAlert('Wrong Otp');
          }
        });
        
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
      
      showSuccess(text)
      {
        let alert = this.alertCtrl.create({
          title:'ThankYou!',
          subTitle: text,
          buttons: ['OK']
        });
        alert.present();
      }
      
      MobileNumber(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
          event.preventDefault();
        }
      }
      
     
      
      
      checkOut(complain_id, status, remark)
      {
        console.log('====================================');
        console.log(complain_id);
        console.log('====================================');
        this.dbService.onPostRequestDataFromApi( {'plumber_id': this.dbService.userStorageData.id, 'status':status, 'remark':remark, 'complaint_id':complain_id, 'cust_lat': this.new_lat,'cust_long':this.new_long,},'app_karigar/plumberCheckOut', this.dbService.rootUrl).subscribe(result =>
          {
            console.log(result);
            if(result['msg']=='CheckoutSuccess')
            {
                // this.showSuccess("Complaint close Successfully!")
              }
              else(result['msg']=='failed')
              {
                // alert('Geo Location not found! Try Again');
                // this.showSuccess("Geo Location not found!")   ;
                return;
                
              }
            });
            
          }
          
          
        }
        