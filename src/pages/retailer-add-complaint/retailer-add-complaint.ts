import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ComplaintHistoryPage } from '../complaints/complaint-history/complaint-history';

/**
 * Generated class for the RetailerAddComplaintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-retailer-add-complaint',
  templateUrl: 'retailer-add-complaint.html',
})
export class RetailerAddComplaintPage {
  data:any={};
  state_list:any=[];
  district_list:any=[];
  city_list:any=[];
  pincode_list:any=[];
  selectedFile:any=[];
  file_name:any=[];
  karigar_id:any='';
  formData= new FormData();
  myphoto:any;
  profile_data:any='';
  loading:Loading;
  today_date:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,  public dbService:DbserviceProvider,  private loadingCtrl:LoadingController) {
  
    this.getstatelist();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RetailerAddComplaintPage');
    this.data.type = this.navParams.get('loginType');
    // this.data.type = "Customer";
    console.log(this.data.type);
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


      submit(){
        this.data.customer_id = this.dbService.userStorageData.id;
        this.dbService.presentLoading();
        this.dbService.onPostRequestDataFromApi( {'complaint':this.data,}, 'app_karigar/addComplaint', this.dbService.rootUrl).subscribe( r =>
          {
            console.log(r);
            this.dbService.onDismissLoadingHandler();
            if(r['status'] == 'success'){
              this.navCtrl.push(ComplaintHistoryPage);
              console.log('====================================');
              console.log('success');
              console.log('====================================');
            }

          });
      }

      MobileNumber(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
          event.preventDefault();
        }
      }
}
