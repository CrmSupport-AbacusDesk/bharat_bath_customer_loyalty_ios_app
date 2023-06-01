
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MasterSearchPage } from '../master-search/master-search';



@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
  cat_id:any='';
  filter :any = {};
  prod_list_data:any=[];
  prod_cat:any={};
  prod_count:any='';
  loading:Loading;
  total_count:any='';
  flag:any='';
  no_rec:any=false;
  skelton:any={}
  imageUrl:any;
  sub_catlength:number=0;
  // url:any='https://phpstack-83335-1980946.cloudwaysapps.com//dd_api/app/Http/Controllers/Admin/Master/appOfflineUploads/productImage/'



  // Mohit Singh
  data:any ={};


  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController, private app:App) {
    this.service.presentLoading();
    this.skelton = new Array(10);
    console.log(navParams);
    this.data  = this.navParams.data;


    this.imageUrl = this.service.product_img_url;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
    this.cat_id = this.navParams.get('id');

    if(this.navParams.get('search')){
      console.log(this.navParams.get('search'));
      this.getProductList(this.navParams.get(''), this.navParams.get('search'));
      this.data.name  = this.navParams.get('search');
    }
    else{
      this.getProductList(this.cat_id,'');
    }

    
  }
  
  // goOnProductSubDetailPage(id){
  //   this.navCtrl.push(ProductSubdetailPage,{'id':id})
  // }
  

    
  goToMasterSearch(){
    this.navCtrl.push(MasterSearchPage)
  }

  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.flag = '';
    this.getProductList(this.cat_id,''); 
    refresher.complete();
  }
  
  getProductList(id,search)
  {
    console.log(search);
    this.filter.search=search;
    this.filter.limit = 0;
    this.filter.karigar_id = this.service.userStorageData.id
    this.filter.id=id;
    // this.dbService.presentLoading();
    this.service.post_rqst({'filter':this.filter},'app_master/productList')
    .subscribe( (r) =>
    {
      console.log(r);
      this.service.onDismissLoadingHandler();
      this.prod_list_data = r.products;
      if(this.prod_list_data.length == 0)
      {
        this.no_rec = true;
      }
      else
      {
        this.no_rec = false;
      }
      
    },(error: any) => {
    })
  }

  checkSubCategory(item)
  {
    console.log(item);
    
    this.navCtrl.push(ProductSubdetailPage,{'name':item.product_name,'id':item.id})
  }


  
  // loadData(infiniteScroll)
  // {
  //   console.log('loading');
    
  //   this.filter.limit=this.prod_list.length;
  //   this.service.post_rqst({'filter' : this.filter},'app_master/productList').subscribe( r =>
  //     {
  //       console.log(r);
  //       if(r['products']=='')
  //       {
  //         console.log('hello');
  //         this.flag=1;
  //       }
  //       else
  //       {
  //         setTimeout(()=>{
  //           this.prod_list=this.prod_list.concat(r['products']);
  //           console.log('Asyn operation has stop')
  //           for (let index =(this.prod_list.length - r['products'].length); index < this.prod_list.length; index++) {
        
  //                 if(this.prod_list[index]['image'] && this.prod_list[index]['image'].search("base64") == -1) {

  //                      this.prod_list[index].image = this.imageUrl + this.prod_list[index].image;

  //                 }  else {

  //                     //  this.getImages(this.prod_list[index]['id'],index);
                    
  //                 }
  //           }

  //           infiniteScroll.complete();
  //         },1000);
  //       }
  //     });
  //   }
   
    ionViewDidLeave()
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
  