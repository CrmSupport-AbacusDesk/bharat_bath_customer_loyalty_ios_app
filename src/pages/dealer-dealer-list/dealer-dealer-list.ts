import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, App, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DistributorDetailPage } from '../sales-app/distributor-detail/distributor-detail';
import { ViewProfilePage } from '../view-profile/view-profile';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
    selector: 'page-dealer-dealer-list',
    templateUrl: 'dealer-dealer-list.html',
})
export class DealerDealerListPage
{
    complaint_list : any=[];
    loading:Loading;
    filter:any={};
    flag:any='';
    complaint_count:any='';
    data:any={};
    complaint: string = "Pending";
    dealerData:any =[];
    constructor( private app:App,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public storage:Storage,
        public dbService:DbserviceProvider,
        public loadingCtrl: LoadingController){
            this.getDealer()
        }
        
        ionViewWillEnter()
        {
            
        }
        ionViewDidLoad() {
            this.dbService.presentLoading();
        }
        
        
        
        doRefresh(refresher)
        {
            this.getDealer();
            refresher.complete();
        }
        
        getDealer()
        {
            this.flag=0;
            this.filter.limit = 0;
            this.dbService.onPostRequestDataFromApi( {'filter':this.filter}, 'app_karigar/dealerList', this.dbService.rootUrl).subscribe(response =>
                {
                    console.log(response);
                    this.dbService.onDismissLoadingHandler();
                    this.dealerData =  response.dealers;
                });
            }
            
            loadData(infiniteScroll)
            {
                this.filter.limit=this.dealerData.length;
                this.dbService.onPostRequestDataFromApi({'filter' : this.filter},'app_karigar/dealerList', this.dbService.rootUrl).subscribe( r =>
                    {
                        if(r['dealers']=='')
                        {
                            this.flag=1;
                        }
                        else
                        {
                            setTimeout(()=>{
                                this.dealerData=this.dealerData.concat(r['dealers']);
                                infiniteScroll.complete();
                            },1000);
                        }
                    });
                }
                
                
            }
            