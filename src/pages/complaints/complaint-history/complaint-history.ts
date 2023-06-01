import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { ComplaintDetailPage} from '../../complaints/complaint-detail/complaint-detail';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { AddNewComplaintPage } from '../add-new-complaint/add-new-complaint';


/**
* Generated class for the ComplaintHistoryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-complaint-history',
  templateUrl: 'complaint-history.html',
})
export class ComplaintHistoryPage {
  complaint_list : any=[];
  loading:Loading;
  filter:any={};
  flag:any='';
  complaint_count:any='';
  data:any={};
  complaint: string = "Pending";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public alertCtrl:AlertController,
              public loadingCtrl:LoadingController)
  {
    console.log(this.navParams);
    this.data.type  = this.navParams.data.type;
    console.log(this.data.type);
    // this.dbService.presentLoading();

  }

  ionViewDidLoad() {
    this.dbService.presentLoading();
    this.getComplaintHistory(this.data.type, this.complaint);
    this.filter.status='';
    console.log('ionViewDidLoad ComplaintHistoryPage');
  }

  onComplaintdetail(id)
  {
    this.navCtrl.push(ComplaintDetailPage,{'id':id});
  }

  

  doRefresh(refresher, complaint)
  {
    console.log(complaint);
    
    console.log('Begin async operation', refresher);
    this.getComplaintHistory(this.data.type, complaint);
    refresher.complete();
  }

  getComplaintHistory(type, complaint_type)
  {
    console.log(type);
    console.log(complaint_type);
    
    this.flag=0;
    this.filter.status = complaint_type;
    this.filter.limit = 0;
    this.dbService.onPostRequestDataFromApi( {'filter':this.filter,type:{type:type}, 'customer_id':this.dbService.userStorageData.id}, 'app_karigar/getComplaintList', this.dbService.rootUrl).subscribe(response =>
      {
        console.log(response);
        this.dbService.onDismissLoadingHandler();
        this.complaint_list = response['complaintList'];
        this.complaint_count = response['complaint_count'];
      });
    }

    loadData(infiniteScroll, type)
    {
      this.filter.limit=this.complaint_list.length;
      this.dbService.onPostRequestDataFromApi({'filter' : this.filter,type:{type:type}, 'customer_id':this.dbService.userStorageData.id},'app_karigar/getComplaintList', this.dbService.rootUrl).subscribe( r =>
        {
          if(r['complaintList']=='')
          {
            this.flag=1;
          }
          else
          {
            setTimeout(()=>{
              this.complaint_list=this.complaint_list.concat(r['complaintList']);
              infiniteScroll.complete();
            },1000);
          }
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


      goOnComplaintAdd(type)
      {
        this.navCtrl.push(AddNewComplaintPage,{'mode':'home',type:type});
      }
      dateFormat(date){
        return this.dbService.changeDateFormat(date)
        // return moment(date).format('YYYY-MM-DD');
      }
      
    }


