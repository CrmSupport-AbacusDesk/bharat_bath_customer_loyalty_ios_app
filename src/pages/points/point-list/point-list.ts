import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,Loading, LoadingController, App} from 'ionic-angular';
import { PointDetailPage } from '../point-detail/point-detail';
import { OffersPage } from '../../offers/offers';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { HomePage } from '../../home/home';
import { TabsPage } from '../../tabs/tabs';
import { PointHistoryPage } from '../../point-history/point-history';
import { Chart } from 'chart.js';


@IonicPage()
@Component({
  selector: 'page-point-list',
  templateUrl: 'point-list.html',
})
export class PointListPage {
  
  @ViewChild("pieCanvas") pieCanvas: ElementRef;
  pieChart: Chart;
  labels:any=[];
  
  
  coupon_list:any=[];
  offerData:any = [];
  offerId:any ={};
  karigar_point:any={};
  karigar_detail:any={};
  loading:Loading;
  filter:any={};
  last_scanned_date:any='';
  referal_his:any=[];
  
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dbService:DbserviceProvider,
    public loadingCtrl:LoadingController,
    private app:App) {

    
      
      if(this.dbService.connection=='offline')
      {
        this.navCtrl.setRoot(HomePage)
      }
    }
    
    ionViewDidLoad() {
      // this.filter.active_tab = 'points';
      
      console.log('ionViewDidLoad PointListPage');
      if(this.dbService.connection!='offline')
      {
        this.getCoupanHistory();
        // this.dbService.presentLoading();
        console.log(this.loading);
      }
      
    }
    
    doRefresh(refresher)
    {
      console.log('Begin async operation', refresher);
      this.getCoupanHistory();
      refresher.complete();
    }
    
    goOnPointDetailPage(id){
      this.navCtrl.push(PointDetailPage,{'id':id})
    }
    
    goOnHomePage(){
      
      // this.navCtrl.push(tab)
      this.navCtrl.push(HomePage);
      
    }
    
    getCoupanHistory()
    {
      this.dbService.presentLoading();
      this.filter.limit=0;
      console.log( this.loading);
    
      this.dbService.onPostRequestDataFromApi( {'filter':this.filter,'karigar_id': this.dbService.userStorageData.id },'app_karigar/couponHistory', this.dbService.rootUrl).subscribe( r =>
        {
          if(r){
            
            this.karigar_point=r['karigar'];

            this.pie_chart(this.karigar_point);
            console.log("karigar point====>",this.karigar_point)
            this.dbService.onDismissLoadingHandler();
          }
          
          
        });
        
        
      }
      conInt(val)
      {
        return parseInt(val)
      }
      
      
      flag:any='';
      loadData(infiniteScroll)
      {
        console.log('loading');
        this.filter.limit=this.coupon_list.length;
        this.dbService.onPostRequestDataFromApi( {'filter':this.filter,'karigar_id': this.dbService.userStorageData.id },'app_karigar/couponHistory', this.dbService.rootUrl).subscribe( r =>
          {
            console.log(r);
            if(r['coupon'] == '')
            { this.flag=1;}
            else
            {
              setTimeout(()=>{
                this.coupon_list=this.coupon_list.concat(r['coupon']);
                console.log('Asyn operation has stop')
                infiniteScroll.complete();
              },1000);
            }
          });
        }
        
        ionViewDidLeave()
        {
          if(this.dbService.connection!='offline')
          {
            let nav = this.app.getActiveNav();
            if(nav && nav.getActive())
            {
              let activeView = nav.getActive().name;
              let previuosView = '';
              if(nav.getPrevious() && nav.getPrevious().name)
              {
                previuosView = nav.getPrevious().name;
              }
              console.log(previuosView);
              console.log(activeView);
              console.log('its leaving');
              if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
              {
                
                console.log(previuosView);
                this.navCtrl.popToRoot();
              }
            }
          }
        }
        balance_point:any=0;
        transaction_detail:any=[];
        
        service(){
          this.filter.limit=0;
          this.dbService.onPostRequestDataFromApi({'plumber_id':this.dbService.userStorageData.id,'filter':this.filter},'app_karigar/getPlumberComplaintList', this.dbService.rootUrl)
          .subscribe((r)=>
          {
            console.log(r);
            if(r)
            {
              this.dbService.onDismissLoadingHandler();
              this.service = r['plumberComplaintList']
              
            }
          });
        }
        referal(){
          this.filter.limit=0;
          this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'filter':this.filter},'app_karigar/referal_logs', this.dbService.rootUrl)
          .subscribe((r)=>
          {
            console.log(r);
            if(r)
            {
              this.dbService.onDismissLoadingHandler();
              this.referal_his = r['referal_logs']
            }
          });
        }
        change_page(mode)
        {
          // this.filter.active_tab = tab;
          if(mode === "scan")
          {
            // this.getCoupanHistory();
            this.navCtrl.push(PointHistoryPage,{"scan":mode})
          }
          if(mode === "service"){
            this.navCtrl.push(PointHistoryPage,{"service":mode})
          }
          if(mode === "referal"){
            this.navCtrl.push(PointHistoryPage,{"referal":mode})
          }
          if(mode == "redeem")
          {
            this.navCtrl.push(PointHistoryPage,{"redeem":mode})
          }
          
          if(this.filter.active_mode == "offer_list")
          {
            // this.getTransactionDetail();
            this.navCtrl.push(OffersPage,{'id':this.offerId});
            
          }
        }
        
        
        pie_chart(point){
          console.log(point);
          
          
          this.pieChart = new Chart(this.pieCanvas.nativeElement, {
            type: "doughnut",
            data: {
              labels: ['Points Earned By Scan', 'Points Earned by Service', 'Points Earned By Referral', 'Points Redeemed'],
              datasets: [{
                label: '# of Votes',
                data: [this.karigar_point.earn_by_scan, this.karigar_point.earn_by_service, this.karigar_point.earn_by_referal, this.karigar_point.total_redeem],
                backgroundColor: [
                  'rgba(0, 124, 214, 0.9)',
                  'rgba(73, 212, 224, 0.9)',
                  'rgba(131, 183, 53, 0.9)',
                  'rgba(255, 0, 0, 0.9)',
                ]
              
                // borderColor: [
                //   'rgba(255, 99, 132, 1)',
                //   'rgba(54, 162, 235, 1)',
                //   'rgba(255, 206, 86, 1)',
                //   'rgba(75, 192, 192, 1)',
                //   'rgba(153, 102, 255, 1)',
                //   'rgba(255, 159, 64, 1)'
                // ],
                // borderWidth: 1
              }]
            }
          });
          
          
        } 
        
      }
      