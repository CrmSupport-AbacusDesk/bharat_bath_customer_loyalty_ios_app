import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MasterSearchPage } from '../master-search/master-search';
import { ProductDetailPage } from '../product-detail/product-detail';

/**
 * Generated class for the ParentSubCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parent-sub-category',
  templateUrl: 'parent-sub-category.html',
})
export class ParentSubCategoryPage {
  sub_cat_list:any=[];
  filter :any = {};
  data:any ={};
  loading:Loading;
  flag:any='';
  imageUrl:any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public service:DbserviceProvider,public loadingCtrl:LoadingController) {
    this.imageUrl = this.service.cat_img;
    console.log(navParams);
    this.data  = this.navParams.data;
    console.log(this.data);

    
  }
  ionViewWillEnter()
  {
    this.service.presentLoading();
    if(this.navParams.get('search')){
      console.log(this.navParams.get('search'));
      this.getProductCategoryList(this.navParams.get('search'));
      this.data.name  = this.navParams.get('search');
    }
    else{
      this.getProductCategoryList('');
    }

   
  }
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.getProductCategoryList(''); 
    this.flag='';
    refresher.complete();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ParentSubCategoryPage');
  }


  getProductCategoryList(search)
  {
    this.filter.limit = 0;
    this.filter.id = this.data.id
    this.filter.search=search;
    
    this.service.post_rqst({'filter' : this.filter},'app_master/getSubCategory')
    .subscribe((r)=>
    {
      console.log(r);
      this.service.onDismissLoadingHandler();
      this.sub_cat_list = r.sub_category;
      console.log(this.sub_cat_list);
      
      
    },(error: any) => {
    })
  }

  checkSubCategory(item)
  {
    console.log(item);
    this.navCtrl.push(ProductDetailPage,{'name':item.main_category,'id':item.id});
  }


    
  goToMasterSearch(){
    this.navCtrl.push(MasterSearchPage)
  }

}
