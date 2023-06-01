import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
* Generated class for the Super30Page page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-super30',
  templateUrl: 'super30.html',
})
export class Super30Page {
  
  plumber_list:any=[];
  loading:Loading;
  filter:any={}
  SelfData:any={}
  test:any=[];
  first_plumber:any ={};
  second_plumber:any ={};
  third_plumber:any ={};
  plumber_id :any= '';
  
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dbService:DbserviceProvider,
    public loadingCtrl:LoadingController) {
      this.dbService.presentLoading();
      
      this.getList();

      this.plumber_id = this.dbService.userStorageData.id
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad Super30Page');
      
    }
    
    
    
    doRefresh(refresher)
    {
      console.log('Begin async operation', refresher);
      this.getList();
      refresher.complete();
    }
    
    newPlumber:any = [];
    rank:number = 0;
    getList()
    {
      this.filter.limit = 0;
      
      
      
      this.dbService.onPostRequestDataFromApi( {'filter':this.filter,'karigar_id':this.dbService.userStorageData.id},'app_karigar/getSuperPlumberList', this.dbService.rootUrl).subscribe(response =>
        {
          this.plumber_list = response['karigars'];
          this.first_plumber = response['karigars'][0];
          this.second_plumber = response['karigars'][1];
          this.third_plumber = response['karigars'][2];
          this.rank = response.rank;
          
          for (let i = 0; i < this.plumber_list.length; i++) 
          {
            if(i>2){
              this.newPlumber.push(this.plumber_list[i]);
            }
          }
          
          console.log(this.newPlumber);
          
          this.dbService.onDismissLoadingHandler();
          
          
          
          
          var index = response['karigarData'].findIndex(row=>row.id==this.dbService.userStorageData.id);
          if(index!=-1)
          {
            this.SelfData.id = response['karigarData'][index].id;
            console.log(this.SelfData.id)
            this.SelfData.index  = index+1
            console.log(this.SelfData.index)
            console.log(index)
            this.dbService.onDismissLoadingHandler(); 
          }
          console.log(response['karigarData'][index]);
          
          // this.SelfData = '';
          // this.showSuccess("Profile Photo Updated")
        });
      }
      
      flag:any='';
      
      
      loadData(infiniteScroll)
      {
        console.log('loading');
        
        this.filter.limit=this.plumber_list.length;
        this.dbService.onPostRequestDataFromApi({'filter' : this.filter},'app_karigar/getSuperPlumberList', this.dbService.rootUrl).subscribe( r =>
          {
            console.log(r);
            if(r['karigars']=='')
            {
              this.flag=1;
            }
            else
            {
              setTimeout(()=>{
                this.plumber_list=this.plumber_list.concat(r['karigars']);
                console.log('Asyn operation has stop')
                infiniteScroll.complete();
              },1000);
            }
          });
        }
        
      }
      