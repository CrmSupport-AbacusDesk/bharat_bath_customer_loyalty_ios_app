import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Loading} from 'ionic-angular';
import { SurveyDetailPage } from '../survey-detail/survey-detail';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';


@IonicPage()
@Component({
  selector: 'page-survey-list',
  templateUrl: 'survey-list.html',
})
export class SurveyListPage {

  surveyList:any=[];
  loading:Loading;

  constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public service:DbserviceProvider,
     public dbService:DbserviceProvider,
     public loadingCtrl:LoadingController,
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SurveyListPage');
    this.getSurveyList();
    this.dbService.presentLoading();
    console.log(this.loading);
  }

  Slist(id){
    this.navCtrl.push(SurveyDetailPage,{id:id})
  }

  

  getSurveyList()
  {
    this.dbService.onPostRequestDataFromApi({user_id: this.dbService.userStorageData.id},'master/surveyList', this.dbService.rootUrl).subscribe(response =>
      {
        console.log(response);
        this.dbService.onDismissLoadingHandler();
        console.log( this.loading);

        if(response != null){
          this.surveyList = response.surveyList['data']
          console.log(this.surveyList);  
        }
        
      });
      
    }
          

    doRefresh(refresher) {
      console.log('Begin async operation', refresher);
  
      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
      }, 2000);
    }
}
