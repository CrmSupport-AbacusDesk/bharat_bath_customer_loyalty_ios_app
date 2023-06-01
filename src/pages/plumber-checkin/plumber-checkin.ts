import { Component, ElementRef, ViewChild } from '@angular/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Geolocation } from '@ionic-native/geolocation';
// import { HomePage } from '../home/home';
// import { MyCamplaintsPage } from '../plumber-camplaints/my-camplaints/my-camplaints';
import { PulmberCustomerDetailPage } from '../plumber-camplaints/pulmber-customer-detail/pulmber-customer-detail';
/**
* Generated class for the PlumberCheckinPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
declare var google;

@IonicPage()
@Component({
  selector: 'page-plumber-checkin',
  templateUrl: 'plumber-checkin.html',
})
export class PlumberCheckinPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  complaint_list:any= [];
  complaint_detail:any= {};
  filter:any={};
  complaint_id:any={};
  data:any={};
  data2:any={};
  new_lat:any;
  comType:any = '';
  new_long:any;
  geoAddress:any='';
  type:any;
  com_remark:any;
  checkin_time:any = true;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider, public alertCtrl: AlertController,  public geolocation: Geolocation ,private nativeGeocoder: NativeGeocoder, public toastCtrl:ToastController,  public locationAccuracy: LocationAccuracy,) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PlumberCheckinPage');
    this.getComplaintList(this.data.type);
    this.getComplaintDetail(this.complaint_detail.complaintId);
    // this.getType();
    this.loadMap();
  }
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  
  showAlert() {
    const alert = this.alertCtrl.create({
      subTitle: 'No complain exits',
      buttons: ['OK']
    });
    alert.present();
  }
  
  
  loadMap() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
    .then(() => {
      // let options = {
      //   maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
      // };
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
        
        this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
        
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMarker(this.map);
        
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
  
  addMarker(map:any){
    
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: map.getCenter()
    });
    
    let content = this.geoAddress;
    
    this.addInfoWindow(marker, content);
    
  }
  
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
  
  
  
  getComplaintList(type)
  {
    if(this.data.complaint){
      this.comType = this.data.complaint;
      
    }
    else{
      this.comType = '';
    }
    this.filter.limit = 0;
    this.dbService.onPostRequestDataFromApi( {'filter':this.filter, 'plumber_id':this.dbService.userStorageData.id, type:this.comType},'app_karigar/checkinComplaintList', this.dbService.rootUrl).subscribe(response =>
      {
        console.log("complainList =====>",response);
        // this.loading.dismiss();
        if(response['complaintList'] != ''){
          this.complaint_list = response['complaintList'];
        }
        // else{
        //   this.showAlert();
        //   return
        // }
        
      });
    }
    goDetailPage(){
      for (let i = 0; i < this.complaint_list.length; i++) {
        if(this.complaint_list[i].complaintId == this.data.complaint){
          if(this.complaint_list[i].complaint_type == "service"){
            this.navCtrl.push(PulmberCustomerDetailPage,{type:'service', 'id':this.complaint_list[i].complaintId, 'close_com':true});
            this.checkin(this.complaint_list[i].complaintId);
          }
          // else if(this.complaint_list[i].complaint_type == "service"){
          //     this.navCtrl.push(PulmberCustomerDetailPage,{type:'service', 'id':this.complaint_list[i].complaintId, 'close_com':true});
          //     this.checkin(this.complaint_list[i].complaintId);
          // }
          else{
            this.navCtrl.push(PulmberCustomerDetailPage,{type:'installation', 'id':this.complaint_list[i].complaintId, 'close_com':true});
            this.checkin(this.complaint_list[i].complaintId);
          }
          
        }
      }
    }
    
    getComplaintDetail(id)
    {
      console.log('====================================');
      console.log("id ===>",id);
      console.log('====================================');
      this.filter.limit = 0;
      this.dbService.onPostRequestDataFromApi( {'filter':this.filter, 'plumber_id':this.dbService.userStorageData.id, 'complaint_id':this.comType},'app_karigar/checkinComplaintDetail', this.dbService.rootUrl).subscribe(response =>
        {
          console.log("getComplaintDetail res ====> ",response);
          this.complaint_detail = response['complaintDetail'];
          console.log('====================================');
          console.log("complaint detail===>",this.complaint_detail);
          console.log('====================================');
        });
      }
      
      checkin(complain_id)
      {
        // this.geoAddress='NIT';
        console.log('====================================');
        console.log("complian id ===>",complain_id);
        console.log('====================================');
        // console.log(this.geoAddress);
        // console.log(this.new_lat);
        // console.log(this.new_long);
        this.checkin_time = false;
        this.dbService.onPostRequestDataFromApi( {'plumber_id': this.dbService.userStorageData.id, 'complaint_id':complain_id, 'cust_lat': this.new_lat,'cust_long':this.new_long},'app_karigar/plumberCheckIn', this.dbService.rootUrl).subscribe(result =>
          {
            console.log(result);
            if(result['msg']=='CheckinSuccess')
            {
              this.showSuccess("Geo Location updated Successfully!")   ;
            }
            else{
              
              alert('Geo Location not found! Try Again');
              return;
            }
            
            // alert('Geo Location not found! Try Again');
            // return;
            
            // this.navCtrl.setRoot(TabsPage,{index:'5'});
            //   this.navCtrl.setRoot(ProfilePage);
            
          });
          
        }
        
        
        showSuccess(text)
        {
          let alert = this.alertCtrl.create({
            title:'Success!',
            subTitle: text,
            buttons: ['OK']
          });
          alert.present();
        }
        
      }
      