import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { CategoryPage } from '../category/category';
import { ParentSubCategoryPage } from '../parent-sub-category/parent-sub-category';
import { ProductDetailPage } from '../product-detail/product-detail';
import { ProductsPage } from '../products/products';

/**
* Generated class for the MasterSearchPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-master-search',
  templateUrl: 'master-search.html',
})
export class MasterSearchPage {
  filter :any = {};
  subcat_list:any = [];
  status:any='';
  globalsearch:any='';
  searchfornotFound:any='';
  main_category:any='';
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public service:DbserviceProvider, public loadingCtrl:LoadingController) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad MasterSearchPage');
  }
  
  Globalsearch=(event)=>
  {
    if(localStorage.getItem('subCat') == 'subCat'){
      this.filter.search='';
    }
    else if(localStorage.getItem('product') == 'product'){
      this.filter.search='';
    }
    else if(localStorage.getItem('product_detailpage') == 'product_detailpage'){
      this.filter.search='';
    }
    // if(e.target.value.length)
    this.service.post_rqst({'search':this.filter.search},'app_master/searchProductsfromCategory')
    .subscribe( (r) =>
    {
      console.log(r);
      this.status = r['status']
      if(r.status == 'REQUIRED'){
        this.globalsearch = [];
        this.service.onDismissLoadingHandler();
      }
      else if(r.status == 'EMPTY'){
        this.globalsearch = [];
        this.service.onDismissLoadingHandler();
      }
      else if(this.filter.search == ''){
        this.searchfornotFound = false;
        this.globalsearch=[];
        this.service.onDismissLoadingHandler();
        
        console.log("serch is blank===>",  this.globalsearch)
      }else if(this.filter.search != ''){
        this.globalsearch = r['data']
        this.service.onDismissLoadingHandler();
        this.searchfornotFound = true;
        console.log("serch is not blank===>",  this.globalsearch)
      }
    });   
  }



  goOnCat(cat_name){
    this.navCtrl.push(CategoryPage,{'mode':'home', 'search':cat_name});
  }

  goOnSubcat(name, id){
    this.navCtrl.push(ProductsPage,{'search':name, 'id':id})
  }

  goOnParentCat(name, id){
    this.navCtrl.push(ParentSubCategoryPage,{'search':name, 'id':id})
  }
  goOnProduct(name, id){
    this.navCtrl.push(ProductDetailPage,{'search':name, 'id':id});
  }


  // goOnProductPage(cat_name){
  //   this.navCtrl.push(CategoryPage,{'mode':'home', 'search':cat_name});
  // }


}
