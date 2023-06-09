import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, PopoverController, ToastController, AlertController } from 'ionic-angular';
import { DealerExecutiveListPage } from '../dealer-executive-list/dealer-executive-list';
import { Storage } from '@ionic/storage';
import { ExecutiveEditPage } from '../executive-edit/executive-edit';
import { ExecutivePopoverPage } from '../executive-popover/executive-popover';
import { AttendencePage } from '../attendence/attendence';
import { LeaveListPage } from '../leave-list/leave-list';
import { DistributorListPage } from '../sales-app/distributor-list/distributor-list';
import { CheckinListPage } from '../sales-app/checkin-list/checkin-list';
import { TravelListPage } from '../travel-list/travel-list';
import { OrderListPage } from '../order-list/order-list';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
* Generated class for the ExecutivDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
    selector: 'page-executiv-detail',
    templateUrl: 'executiv-detail.html',
})
export class ExecutivDetailPage {

    userId:any;
    executive_data:any ={};
    dr_id:any
    constructor(
                // private app:App,
                public navCtrl: NavController,
                public navParams: NavParams,
                public dbService:DbserviceProvider,
                public loadingCtrl: LoadingController,
                public popoverCtrl: PopoverController,
                public toastCtrl:ToastController,
                private alertCtrl: AlertController,
                public storage:Storage) {

        if(this.navParams.get('id'))
        {
            this.userId = this.navParams.get('id');
        }

        console.log(this.userId);

        this.dr_id = this.dbService.userStorageData.id;
        this.executive_detail();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DistributorDetailPage');
    }

    loading:any;
    lodingPersent()
    {
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
        });
        this.loading.present();
    }
    editExecutive()
    {
        console.log(this.userId);
        this.navCtrl.push(ExecutiveEditPage,{userId:this.userId})
    }

    presentPopover(event,id) {
        console.log(event);
        // alert(id);

        const popover = this.popoverCtrl.create(ExecutivePopoverPage,{userId:id});
         popover.present({
                ev: event
              });
      }

    deleteExecutive()
    {
        let alert=this.alertCtrl.create({
            title:'Are You Sure?',
            subTitle: 'You Want To Delete this Executive ?',
            cssClass:'action-close',

            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    this.dbService.presentToast('Action Cancelled')
                }
            },
            {
                text:'Confirm',
                cssClass: 'close-action-sheet',
                handler:()=>
                {
                        const resp = this.dbService.userStorageData;
                        console.log(resp);
                        this.dr_id = resp.id
                        this.dbService.onPostRequestDataFromApi({"userId":this.userId,dr_id:this.dr_id},"dealerData/executive_delete", this.dbService.rootUrlSfa).subscribe(resp=>
                            {
                                console.log(resp);
                                this.dbService.presentToast('Deleted')
                                this.navCtrl.push(DealerExecutiveListPage)
                            },err=>
                            {
                                this.dbService.onDismissLoadingHandler();
                                this.dbService.errToasr();
                            })

                    }
                }]
            });
            alert.present();

        }
        executive_detail()
        {
            this.dbService.onShowLoadingHandler();
            this.dbService.onPostRequestDataFromApi({"userId":this.userId,},"dealerData/executive_detail", this.dbService.rootUrlSfa).subscribe(resp=>
                {
                    this.dbService.onDismissLoadingHandler();
                    console.log(resp);

                    this.executive_data = resp["executive_data"];
                    this.executive_data.tabActive='Order';

                },err=>
                {
                    this.dbService.onDismissLoadingHandler();
                    this.dbService.errToasr();
                })
            }

            viewAttendance(id)
            {
                this.navCtrl.push(AttendencePage,{'userId':id})
            }
            viewLeaves(id)
            {
                this.navCtrl.push(LeaveListPage,{'userId':id})
            }
            viewLeads(id)
            {
                this.navCtrl.push(DistributorListPage,{'userId':id})
            }
            viewCheckin(id)
            {
                this.navCtrl.push(CheckinListPage,{'userId':id})
            }
            viewTravelPlan(id)
            {
                this.navCtrl.push(TravelListPage,{'userId':id})
            }
            viewPrimaryOrder(id)
            {
                this.navCtrl.push(OrderListPage,{'userId':id,type:'Primary'})
            }
            viewSecondaryOrder(id)
            {
                this.navCtrl.push(OrderListPage,{'userId':id,type:'Secondary'})
            }
            chngeStatus(type,value)
            {
                let alert=this.alertCtrl.create({
                    title:'Are You Sure?',
                    subTitle: 'You Want To '+type+' This Executive ?',
                    cssClass:'action-close',

                    buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            this.dbService.presentToast('Action Cancelled')
                        }
                    },
                    {
                        text:'Confirm',
                        cssClass: 'close-action-sheet',
                        handler:()=>
                        {
                            console.log(this.executive_data.id);

                            this.dbService.onPostRequestDataFromApi({"id":this.executive_data.id,'type':type,value:value},"dealerData/chngeStatusUser", this.dbService.rootUrlSfa)
                            .subscribe(resp=>{
                                console.log(resp);
                                this.dbService.presentToast('Executive '+type+'ed Successfully !!')
                                this.executive_detail()
                            });
                        }
                        }]
                    });
                    alert.present();
            }
        }
