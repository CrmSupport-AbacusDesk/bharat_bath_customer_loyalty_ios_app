import { Component,ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController, ModalController,ToastController, PopoverController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { TaskClosePage } from '../../task-close/task-close';
import { ViewProfilePage } from '../../view-profile/view-profile';
import { DomSanitizer } from '@angular/platform-browser';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { ComplaintRemarksPage } from '../../complaint-remarks/complaint-remarks';
import { PlumberCheckinPage } from '../../plumber-checkin/plumber-checkin';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { SparePartAddPage } from '../../spare-part-add/spare-part-add';


/**
* Generated class for the ComplaintDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
declare var google;

@IonicPage()
@Component({
  selector: 'page-pulmber-customer-detail',
  templateUrl: 'pulmber-customer-detail.html',
})
export class PulmberCustomerDetailPage {
  @ViewChild('map') mapElement: ElementRef;
  complaint_id:any='';
  plumber_detail:any={};
  complaint_media:any=[];
  loading: Loading;
  new_long: any;
  new_lat: any;
  close_com:any;
  remark_count:any;
  karigar_detail:any;
  last_point:any;
  today_point:any;
  mode=1;
  mode_new=3;
  geoAddress:any='';
  map: any;
  checkin_time:any = true;
  checkinFlag:any = true;
  spare_arr: any = [];
  complaint: string = "parts";
  url: string = "";
  invoiceImg:any=[];
  
  
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dbService:DbserviceProvider,
    public loadingCtrl:LoadingController ,
    public modalCtrl: ModalController,
    public sanitizer: DomSanitizer ,
    public geolocation: Geolocation,
    public popoverCtrl: PopoverController,
    private launchNavigator: LaunchNavigator,
    public locationAccuracy: LocationAccuracy,
    private nativeGeocoder: NativeGeocoder,
    public toastCtrl:ToastController,
    public alertCtrl:AlertController,
    ) {
      this.close_com = this.navParams.get('close_com');
      this.url = dbService.upload_url3
    }
    
    photoURL(url) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    
    
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad PulmberCustomerDetailPage');
      this.dbService.presentLoading();
      
      this.complaint_id = this.navParams.get('id');
      console.log(this.navParams.get('id'));
      console.log('retun add spare page',this.navParams.get('backcheckinFlag'));
      if(this.navParams.get('backcheckinFlag') == true){
        this.checkinFlag = this.navParams.get('checkinFlag');
      }
      
      
      
      
      
      this.getPlumberDetail(this.complaint_id);
      // this.getData();
    }
    
    geoencoderOptions: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    
    addInfoWindow(marker, content){
      
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });
    }
    
    
    getGeoencoder(latitude,longitude)
    {
      this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        // alert('Error getting location'+ JSON.stringify(error));
      });
    }
    
    
    generateAddress(addressObj){
      let obj = [];
      let address = "";
      for (let key in addressObj) {
        obj.push(addressObj[key]);
      }
      obj.reverse();
      for (let val in obj) {
        if(obj[val].length)
        address += obj[val]+', ';
      }
      // console.log(address);
      
      return address.slice(0, -2);
    }
    
    
    complaint_remark:any =[];
    getComplaintRemark()
    {
      this.dbService.presentLoading();
      this.dbService.onPostRequestDataFromApi( {'complaints_id':this.complaint_id},'app_karigar/getComplaintHistoryRemark', this.dbService.rootUrl).subscribe(response =>
        {
          console.log(response);
          this.dbService.onDismissLoadingHandler();
          this.complaint_remark = response.complaintHistory;
        });
        
      }
      
      
      deleteItem(i)
      {
        this.dbService.presentLoading();
        this.dbService.onPostRequestDataFromApi({'id': i},'app_karigar/deleteSpareParts', this.dbService.rootUrl).subscribe(
          response => {
            console.log('delete response', response);
          }
          );
          this.getPlumberDetail(this.complaint_id);
        }
        
        getPlumberDetail(id)
        {
          // console.log('getPlumberDetail ---> ', this.dbService.sparepart_global);
          this.dbService.onPostRequestDataFromApi( {'complaints_id':id},'app_karigar/getComplaintbyId', this.dbService.rootUrl).subscribe(response =>
            {
              console.log(response);
              this.dbService.onDismissLoadingHandler();
              this.plumber_detail = response['complaintDetails'];
              this.spare_arr = this.plumber_detail['spare_parts'];
              this.complaint_media = response['complaintDetails']['image'] ;
              this.invoiceImg = response['complaintDetails']['bill'] ;
              this.remark_count =response.complaintHistoryCount;
              
              
              // if(this.complaint_media[0].type == "video"){
              //   for (let i = 0; i < this.complaint_media.length; i++) {
              //     this.complaint_media[i].file_name =  this.sanitizer.bypassSecurityTrustResourceUrl( this.dbService.upload_url+'app/uploads/'+this.complaint_media[i].file_name);
              //   }
              // }else{
              //   for (let i = 0; i < this.complaint_media.length; i++) {
              //     this.complaint_media[i].file_name =  this.sanitizer.bypassSecurityTrustResourceUrl( this.complaint_media[i].file_name);
              
              //   }
              // }
            });
            
          }
          
     
          
          goToTaskPage(lable)
          {
            this.navCtrl.push( TaskClosePage,{'id':this.plumber_detail.complaintId,'mobile':this.plumber_detail.customerMobileNo,'name':this.plumber_detail.customerName,'lable':lable});
          }
          
          getDirection()
          {
            // this.navCtrl.push(PointLocationPage,{'lat':this.plumber_detail.cust_lat,'log':this.plumber_detail.cust_long,'old_loc':this.plumber_detail.cust_geo_address});
            
            this.geolocation.getCurrentPosition().then((resp) => {
              // let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
              
              this.new_lat=resp.coords.latitude;
              this.new_long=resp.coords.longitude;
              var latLong= this.new_lat+','+this.new_long;
              
              let options: LaunchNavigatorOptions = {
                start: latLong,
                // app: LaunchNavigator.APPS.UBER
              };
              
              this.launchNavigator.navigate(this.plumber_detail.cust_lat+','+this.plumber_detail.cust_long, options)
              .then(
                success => console.log('Launched navigator'),
                error => console.log('Error launching navigator', error)
                );
              });
              
            }
            
            goToRemarkHistory()
            {
              this.navCtrl.push(ComplaintRemarksPage,{'id':this.plumber_detail.complaintId})
            }
            
            loadMap() {
              // this.checkinPass(); 


              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
              .then(() => {
                let options = {
                  maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
                };
                this.geolocation.getCurrentPosition(options)
                .then((resp) => {
                  console.log('response geolocation', resp);
                  this.new_lat = resp.coords.latitude
                  this.new_long = resp.coords.longitude;
                  console.log('====================250================');
                  console.log('test fucnation');
                  console.log('===================252=================');
                  this.checkinPass(); 
                  console.log('test fucnation 254');
              
                  
                  
                },
                error => {
                  console.log('Error requesting location permissions', error);
                  if(error){
                    let alert = this.alertCtrl.create({
                      title:'Alert!',
                      cssClass:'action-close',
                      subTitle:"Enable to get your location",
                      buttons: ['OK']
                    });
                    alert.present();  
                  }
                  
                });
              });
              
        
              
            }
            
            
            checkin(){
              this.loadMap(); 
            }
            
            
            
            showAlert(text)
            {
              let alert = this.alertCtrl.create({
                title:'Alert!',
                cssClass:'action-close',
                subTitle: text,
                buttons: ['OK']
              });
              alert.present();
            }
            
            checkinPass(){
              this.checkin_time = false;
              this.checkinFlag= false;
              this.dbService.onPostRequestDataFromApi( {'plumber_id': this.dbService.userStorageData.id, 'complaint_id':this.plumber_detail.complaintId, 'cust_lat': this.new_lat,'cust_long':this.new_long},'app_karigar/plumberCheckIn', this.dbService.rootUrl).subscribe(result =>
                {
                  console.log('plumberCheckIn response',result);
                  if(result['msg']=='CheckinSuccess')
                  {
                    console.log('locations updated');
                    let toast = this.toastCtrl.create({
                      message: 'Location update success',
                      duration: 3000,
                      position: 'bottom'
                    });
                  }
                  
                  
                  // alert('Geo Location not found! Try Again');
                  // return;
                  
                  // this.navCtrl.setRoot(TabsPage,{index:'5'});
                  //   this.navCtrl.setRoot(ProfilePage);
                  
                });
              }
              
              
              addMarker(map:any){
                
                let marker = new google.maps.Marker({
                  map: map,
                  animation: google.maps.Animation.DROP,
                  position: map.getCenter()
                });
                
                let content = this.geoAddress;
                
                this.addInfoWindow(marker, content);
                
              }
              
              
              presentCancelPolicyModal() {
                let contactModal = this.modalCtrl.create(SparePartAddPage, {'id':this.plumber_detail.complaintId});
                // {'karigar_id':this.dbService.userStorageData.id}
                contactModal.present();
                console.log('otp');
              }
              
              
              
              viewImage(image)
              {
                this.modalCtrl.create(ViewProfilePage, {"Image": image}).present();
              }
              
            }
            