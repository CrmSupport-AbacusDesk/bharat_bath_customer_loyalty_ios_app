import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, AlertController, Loading, ToastController, } from 'ionic-angular';
import { Camera ,CameraOptions} from '@ionic-native/camera';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { TabsPage } from '../../tabs/tabs';
import { MediaCapture, CaptureVideoOptions, MediaFile } from '@ionic-native/media-capture';
// import { FileTransfer, FileUploadOptions,FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DomSanitizer } from '@angular/platform-browser';
import { PointLocationPage } from '../../point-location/point-location';
import { Storage } from '@ionic/storage';
import { HomePage } from '../../home/home';
import { ComplaintHistoryPage } from '../complaint-history/complaint-history';


/**
*
* Generated class for the AddNewComplaintPage page.
*,
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-add-new-complaint',
  templateUrl: 'add-new-complaint.html',
})
export class AddNewComplaintPage {
  loading:Loading;
  isCameraEnabled 		: boolean 	= false;
  categoryArr:any = [];
  subCategoryArr:any=[]
  productArr:any=[];
  // fileChooser: any;
  image_data:any=[];
  bill_data:any=[];
  mindate:any = new Date().toISOString();
  flag:boolean=true;
  stepOne:boolean = true;
  stepTwo:boolean = false;
  
  data:any={};
  document_image:any;
  photos:any;
  filter:any ={};
  karigar_detail:any =''
  state_list:any=[];
  district_list:any=[];
  imageReq:boolean = false;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    public dbService:DbserviceProvider,
    public loadingCtrl:LoadingController,
    public alertCtrl:AlertController,
    private transfer: FileTransfer,
    public diagnostic  : Diagnostic,
    public androidPermissions: AndroidPermissions,
    public toastCtrl: ToastController,
    public dom:DomSanitizer) {
      this.getMainCategory();
      this.getstatelist();
    }
    
    ionViewDidLoad() {
      this.dbService.presentLoading();
      this.getKarigarDetail();
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
    
    
    formStep(){
      this.stepTwo= true;
      this.stepOne = false;
    }
    backForm(){
      this.stepTwo= false;
      this.stepOne = true
    }
    
    mainCategory:any=[];
    getMainCategory()
    {
      this.filter.search ='';
      this.filter.karigar_id = this.dbService.userStorageData.id
      this.dbService.post_rqst({'filter' : this.filter},'app_master/parentCategory_List')
      .subscribe((r) =>
      {
        // this.service.onDismissLoadingHandler();
        console.log(r);
        this.mainCategory=r['categories'];
      });
    }
    
    presentToast(text) {
      const toast = this.toastCtrl.create({
        message: text,
        duration: 3000
      });
      toast.present();
    }
    
    getKarigarDetail()
    {
      console.log('karigar');
      this.dbService.onPostRequestDataFromApi( {'karigar_id': this.dbService.userStorageData.id },'app_karigar/profile', this.dbService.rootUrl).subscribe(r =>
        {
          this.dbService.onDismissLoadingHandler();
          this.karigar_detail=r['karigar'];
          console.log(this.karigar_detail);
          
          this.data.mobile_no  = this.karigar_detail.mobile_no
          
        });
      }
      
      
      getPincode(pincode)
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
              // this.data.address = result.data.address;
              this.getDistrictList(this.data.state)
              this.data.district = result.data.district_name;
              this.data.city = result.data.city;
              console.log(this.data);
            }
          });
        }
        
      }
      
      
      getstatelist()
      {
        this.dbService.onGetRequestDataFromApi('app_karigar/getStates', this.dbService.rootUrl).subscribe( r =>
          {
            this.state_list=r['states'];
          });
        }
        
        getDistrictList(state_name)
        {
          this.dbService.onPostRequestDataFromApi({'state_name':state_name},'app_master/getDistrict', this.dbService.rootUrl).subscribe( r =>
            {
              this.district_list=r['districts'];
            });
          }
          
          getAddress()
          {
            if(this.data.check==true)
            {
              this.data.state = this.karigar_detail.state;
              if(this.data.state){
                this.getDistrictList(this.data.state);
              }
              this.data.district = this.karigar_detail.district; 
              this.data.address = this.karigar_detail.address; 
              this.data.city =this.karigar_detail.city; 
              this.data.pincode = this.karigar_detail.pincode;
            }
            else{
              this.data.state = '';
              this.data.district = '';
              this.data.address = '';
              this.data.city = ''; 
              this.data.pincode = '';
            }
            
            
          }
          
          
          onUploadChange(evt: any) {
            this.imageReq = false;
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
            quality: 80,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth : 1050,
            targetHeight : 800
          }
          
          console.log(options);
          this.camera.getPicture(options).then((imageData) => {
            this.flag=false;
            this.photos = 'data:image/jpeg;base64,' + imageData;
            this.image_data.push({'image_name':this.photos})
            console.log('line number 123',this.image_data);
            this.data.bill_photo = this.image_data;
            
            console.log(this.data.bill_photo, 'line nuber 133 camera');
            
            
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
            this.photos = 'data:image/jpeg;base64,' + imageData;
            this.image_data.push({'image_name':this.photos})
            this.data.bill_photo = this.image_data;
            console.log(this.data.bill_photo, 'line nuber 154 gallery');
            
            
          }, (err) => {
          });
        }
        
        
        uploadBill(evt: any) {
          let actionsheet = this.actionSheetController.create({
            title:" Upload File",
            cssClass: 'cs-actionsheet',
            buttons:[{
              cssClass: 'sheet-m',
              text: 'Camera',
              icon:'camera',
              handler: () => {
                console.log("Camera Clicked");
                this.billPhoto();
              }
            },
            {
              cssClass: 'sheet-m1',
              text: 'Gallery',
              icon:'image',
              handler: () => {
                console.log("Gallery Clicked");
                this.billImage();
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
      billPhoto()
      {
        console.log("i am in camera function");
        const options: CameraOptions = {
          quality: 80,
          destinationType: this.camera.DestinationType.DATA_URL,
          targetWidth : 1050,
          targetHeight : 800
        }
        
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
          this.flag=false;
          this.document_image = 'data:image/jpeg;base64,' + imageData;
          this.bill_data.push({'image_name':this.document_image})
          this.data.billImages = this.bill_data;
        }, (err) => {
        });
      }
      
      billImage()
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
          this.document_image = 'data:image/jpeg;base64,' + imageData;
          this.bill_data.push({'image_name':this.document_image})
          console.log('line number 143',this.bill_data);
          this.data.billImages = this.bill_data;
          
          console.log(this.data.billImages, 'line nuber 237 camera');
          
        }, (err) => {
        });
      }
      
      formData = new FormData();
      
      submit()
      {
        if(this.image_data.length == 0){
          this.imageReq = true;
          this.presentToast('At least one complaint image is required');
          return;
        }
        
        this.data.customer_id = this.dbService.userStorageData.id;
        this.data.created_by = '0';
        let alert=this.alertCtrl.create({
          title:'Confirmation!',
          subTitle: 'Do you want to register a complaint',
          cssClass:'action-close',
          
          buttons: [{
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text:'Yes',
            cssClass: 'close-action-sheet',
            handler:()=>
            {
              
              this.dbService.onPostRequestDataFromApi( {'complaint':this.data },'app_karigar/addComplaint', this.dbService.rootUrl).subscribe(result =>
                { 
                  this.dbService.onDismissLoadingHandler();
                  this.showSuccess("Complaint Added Successfully!");
                  this.navCtrl.popTo(ComplaintHistoryPage);
                });
              }
            }]
          });
          alert.present();
          
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
      
      