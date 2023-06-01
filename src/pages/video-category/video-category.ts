import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { VideoPage } from '../video/video';

/**
* Generated class for the VideoCategoryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-video-category',
  templateUrl: 'video-category.html',
})
export class VideoCategoryPage {

  noRec:any=false
  categoryData:any=[];
  data:any={};
  element:any='';

  constructor(public navCtrl: NavController,
              public dbService:DbserviceProvider,
              public navParams: NavParams) {

       this.getCatData('');
       console.log("this.dbService.userStorageData.language",this.dbService.userStorageData.language)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoCategoryPage');
 
  }

  getCatData(ac)
  {
        this.dbService.onShowLoadingHandler()
        console.log("type==",ac)
        console.log("type==1",this.data.video_type)
        this.dbService.onPostRequestDataFromApi({'type':ac},'app_master/VideoCatData', this.dbService.rootUrl)
        .subscribe( (r) =>
        {
                this.categoryData = r.categories
                console.log(this.categoryData);
                for (let i = 0; i < this.categoryData.length; i++) {
                this.element = this.categoryData[i].category;
                  console.log("individual value ==>",this.element);
                 
                }
                if(this.categoryData.length==0)
                {
                  this.noRec=true;
                }
                this.dbService.onDismissLoadingHandler();

        },(error: any) => {
              this.dbService.onDismissLoadingHandler();
        })
  }
  goToVideosPage(cat){
        console.log(cat);

        this.navCtrl.push(VideoPage,{cat:cat});
  }
  hin:any=''
  
}
