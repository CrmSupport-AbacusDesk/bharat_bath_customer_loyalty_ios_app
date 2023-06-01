import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { filter } from 'rxjs/operator/filter';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { PulmberCustomerDetailPage } from '../plumber-camplaints/pulmber-customer-detail/pulmber-customer-detail';

/**
* Generated class for the SparePartAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-spare-part-add',
  templateUrl: 'spare-part-add.html',
})
export class SparePartAddPage {
  
  checkinFlag= false;
  backcheckinFlag = true
  
  filter:any ={};
  conData:any={};
  conData1:any={};
  today_date:any ={};
  todayDate:any
  spareData:any =[];
  loading:Loading;
  complaint_id:any='';
  sparepart_name:string='';
  // spare_arr: any;
  
  
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public toastCtrl: ToastController, public dbService:DbserviceProvider, public loadingCtrl:LoadingController, public translate:TranslateService) {
    // this.dbService.karigar_id;
    this.complaint_id = this.navParams.get('id');
    console.log(this.complaint_id);
    
    
  }
  
  ionViewDidLoad() {
    this.getspare();
  }
  
  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Delete successfully',
      duration: 3000
    });
    toast.present();
  }
  
  
  
  
  spare:any=[];
  getspare()
  {
    this.dbService.post_rqst({'karigar_id':this.dbService.user_id, 'search':this.filter},'app_karigar/getSpareParts')
    .subscribe(d => {
      console.log(d);
      this.spare = d.spare_parts;
    });
  }
  
  
  addItem()
  {
    if(this.conData1.spare_part_id <= 0){
      const toast = this.toastCtrl.create({
        message: 'Quantity value should be minimum 1',
        duration: 3000
      });
      toast.present();
      return
    }
    
    this.conData1.spare_part_name = this.sparepart_name;
    let val=JSON.parse(JSON.stringify(this.conData1));
    console.log(val);
    // && this.conData1.size_id!=''
    if(this.conData1.spare_part_id != '' && this.conData1.qty!=''){
      this.spareData.push(val);
    }
    console.log(this.spareData);
    this.conData1.spare_part_id='';
    this.conData1.qty='';
    
  }
  
  getSparepartName(sparepart_id){
    let sparepart = this.spare.filter(x => x.id == sparepart_id);
    let sparepart_name = sparepart[0].product_name;
    this.sparepart_name = sparepart_name;
  }
  
  deleteItem(i)
  {
    this.spareData.splice(i,1);
    this.presentToast();
  }
  
  submit(){
    this.conData = this.spareData;
    this.conData.contractor_id = this.dbService.karigar_id;
    
    if(this.spareData < 1){
      const toast = this.toastCtrl.create({
        message: 'please add one item at least!',
        duration: 3000
      });
      toast.present();
      return
    }
    
    this.dbService.post_rqst({'data':this.conData, 'complaint_id':this.complaint_id},'app_karigar/addSpareParts').subscribe( r =>
      {
        console.log(r);
        if(r['status'] == 'SUCCESS'){
          // this.dbService.sparepart_global = this.conData;
          console.log(this.checkinFlag, 'Update spare page');
          
          this.navCtrl.setRoot(PulmberCustomerDetailPage,{'id':this.complaint_id, 'checkinFlag':this.checkinFlag, 'backcheckinFlag':this.backcheckinFlag});
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
    
    
    
    
    dismiss() {
      this.viewCtrl.dismiss();
    }
    
  }
  