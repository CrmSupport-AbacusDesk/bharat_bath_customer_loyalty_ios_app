import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, InfiniteScroll } from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
// import { errorHandler } from '@angular/platform-browser/src/browser';
import { ProductDetailPage } from '../product-detail/product-detail';
import { NewarrivalsPage } from '../newarrivals/newarrivals';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { MasterSearchPage } from '../master-search/master-search';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  prod_cat_list:any=[];
  filter :any = {};
  flag:any='';
  loading:Loading;
  cat_images:any=[];
  category_count:any='';
  no_rec:any=false;
  skelton:any={}
  sklton:any='';
  cat_id:any;
  newArival_imgurl:any='';
  newProducts: string = "";
  
  
  url:string=''
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app:App) {
    this.skelton = new Array(10);
    this.url = this.service.cat_img
    this.newArival_imgurl = service.product_img_url;
    console.log(navParams);

    
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
    this.cat_id = this.navParams.get('id');
    this.service.presentLoading();
    if(this.navParams.get('search')){
      console.log(this.navParams.get('search'));
      this.getProductCategoryList(this.navParams.get('search'));
    }
    else{
      this.getProductCategoryList('');
    }
  }
  ionViewWillEnter()
  {
    
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.getProductCategoryList('');
    this.flag='';
    refresher.complete();
  }
  goToNewArrivals()
  {
    console.log('newArrivals')
    this.navCtrl.push(NewarrivalsPage);
  }
  goOnCategoryListPage(list){
    
    console.log(list.sub_category_count);
    
    if(list.sub_category_count > 0){
      this.navCtrl.push(ProductsPage,{'name':list.main_category, 'id':list.id})
    }
    
    else{
      this.navCtrl.push(ProductDetailPage,{'id':list.id,'name':list.main_category,})
    }
    
    // if(){
    
    // }
    
    
  }

  goToMasterSearch(){
    this.navCtrl.push(MasterSearchPage)
  }
  cat:any=[];
  getCategoryImages(categoryId,index)
  {
    console.log(categoryId)
    //  this.prod_cat_list[index]['image'] = 'http://gravity.abacusdesk.com/dd_api/app/uploads/newarrival.jpg';
    this.service.post_rqst({'categoryid':categoryId},'app_master/getcategoryImage').subscribe((res)=>
    {
      console.log(res)
      this.cat = res['categories']
      // console.log(res['categories'][0]['image'])
      for (let i = 0; i < this.cat.length; i++) {
        const element = this.cat[i];
        console.log("value is===>",element)
        
      }
      // this.prod_cat_list[index]['image'] = res['categories'][0]['image']
      
    })
  }
  
  // loadData(infiniteScroll)
  // {
  //   console.log('loading');
  
  //   this.filter.limit=this.prod_cat_list.length;
  //   this.service.post_rqst({'filter' : this.filter},'app_master/parentCategoryList').subscribe( r =>
  //     {
  //       console.log(r);
  //       if(r['categories']=='')
  //       {
  //         this.flag=1;
  //       }
  //       else
  //       {
  //         setTimeout(()=>{
  //           for (let index = this.prod_cat_list.length; index < r['categories'].length; index++) {
  //             console.log(r['categories'][index])
  //             this.getCategoryImages(r['categories'][index]['main_category'],index)
  //           }
  //           this.prod_cat_list=this.prod_cat_list.concat(r['categories']);
  //           console.log('Asyn operation has stop')
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
  
  getProductCategoryList(search)
  {
    console.log('search',search);
    this.filter.search=search;
    this.filter.karigar_id = this.service.userStorageData.id
    this.filter.limit = 0;
    
    this.service.post_rqst({'filter' : this.filter},'app_master/parentCategory_List')
    .subscribe((r) =>
    {
      // this.service.onDismissLoadingHandler();
      console.log(r);
      this.prod_cat_list=r['categories'];
      // this.prod_cat_list.main_category == "Eco Taps" 
      this.prod_cat_list.length
      if(this.prod_cat_list.length == 0)
      {
        this.no_rec = true;
      }
      else
      {
        this.no_rec = false;
      }
      
      
      for (let index = 0; index < this.prod_cat_list.length; index++) {
        this.sklton = this.prod_cat_list[index]
        
        console.log("this.sklton ======>",this.prod_cat_list.length );
        console.log("this.sklton.main_category",this.prod_cat_list.main_category);
        
        
        this.prod_cat_list.length
        
        // else
        // {
        //   this.no_rec = false;
        // }
        this.getCategoryImages(this.prod_cat_list[index]['main_category'],index)
      }
      this.service.onDismissLoadingHandler();
    },(error: any) => {
      
    }
    );
    
  }
  
  
  
  
  prod_list:any=[];
  prod_cat:any={};
  prod_count:any='';
  // loading:Loading;
  total_count:any='';
  mode:string='';
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
      // this.prod_cat=r['category_name'][0];
      this.prod_count=r['product_count']
      this.total_count=r['product_count_all']
      console.log(this.prod_cat);
      console.log(this.prod_list);
      this.service.onDismissLoadingHandler();
    },(error: any) => {
      this.service.onDismissLoadingHandler();
    })
  }
  newloadData(infiniteScroll)
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
    
    goOnProductSubDetailPage(id){
      this.navCtrl.push(ProductSubdetailPage,{'id':id})
    }
    
  }
  