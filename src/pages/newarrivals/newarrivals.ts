import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';

/**
 * Generated class for the NewarrivalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newarrivals',
  templateUrl: 'newarrivals.html',
})
export class NewarrivalsPage {
  cat_id:any='';
  filter :any = {};
  prod_list:any=[];
  prod_cat:any={};
  prod_count:any='';
  // loading:Loading;
  total_count:any='';
  flag:any='';
  no_rec:any=false;
  skelton:any={};
   newArival_imgurl:any='';
   mode:string='';
   newProducts: string = "new_arrivals";


  constructor(public navCtrl: NavController, public navParams: NavParams ,public service:DbserviceProvider) {
    this.skelton = new Array(10);
    console.log(navParams);
    console.log(navCtrl);
    this.mode = this.navParams.data

    console.log("mode is ===>",this.mode)
    this.service.presentLoading();
    this.getProductList(this.cat_id,'', 'new_arrivals');
    console.log("services",service);
    this.newArival_imgurl = service.product_img_url
   
    // this.imageUrl = service['constant'].image_url+'product/';
  }
  ionViewDidLoad() {
    this.getProductList(this.cat_id,'', 'new_arrivals');
    
  }
  goOnProductSubDetailPage(id){
    this.navCtrl.push(ProductSubdetailPage,{'id':id})
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.flag = '';
    this.getProductList(this.cat_id,'', 'new_arrivals'); 
    refresher.complete();
  }
  loadData(infiniteScroll)
  {
    console.log('loading');
    
    this.filter.limit=this.prod_list.length;
    this.filter.type = this.mode
    this.service.post_rqst({'filter' : this.filter,'type':'New Arivals'},'app_master/newArrivals').subscribe( r =>
      {
        console.log(r);
        if(r['products']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.prod_list=this.prod_list.concat(r['products']);
            console.log('Asyn operation has stop')
            infiniteScroll.complete();
          },1000);
        }
      });
    }
 
  getProductList(id,search, mode)
  {
    console.log(search);
    this.filter.search=search;
    this.filter.limit = 0;
    this.filter.id=id;
    this.filter.type = mode
   
    this.service.post_rqst({'filter':this.filter},'app_master/newArrivals')
    .subscribe( (r) =>
    {
      console.log("new arrvial ===>",r);
     
      this.prod_list=r['products'];
      this.service.onDismissLoadingHandler();

    for (let index = 0; index < this.prod_list.length; index++) {
      if(this.prod_list[index].image.search("base64")=='-1'){
        this.prod_list[index].image = this.prod_list[index].image;
    }else{
      this.prod_list[index].image1 = this.prod_list[index].image;
    }
    }
 
      if(this.prod_list.length == 0)
      {
        this.no_rec = true;
      }
      else
      {
        this.no_rec = false;
      }
      this.prod_cat=r['category_name'][0];
      this.prod_count=r['product_count']
      this.total_count=r['product_count_all']
      console.log(this.prod_cat);
      console.log(this.prod_list);
      this.service.onDismissLoadingHandler();
    },(error: any) => {
      // this.loading.dismiss();
      this.service.onDismissLoadingHandler();
    })
  }

}
