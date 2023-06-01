import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ParentSubCategoryPage } from '../parent-sub-category/parent-sub-category';
import { MasterSearchPage } from '../master-search/master-search';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
  prod_cat_list:any=[];
  sub_cat_list:any=[];
  
  filter :any = {};
  flag:any='';
  loading:Loading;
  cat_images:any=[];
  category_count:any='';
  no_rec:any=false;
  name:any='';
  skelton:any={}
  imageUrl:any;
  subCatName:any ={};
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app:App ) {
    
    
    console.log(navParams);
    
    this.imageUrl = this.service.cat_img;
    this.skelton = new Array(10);
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
    this.filter.id  = this.navParams.get('id');
    this.subCatName  = this.navParams.get('name');
    this.service.presentLoading();
    if(this.navParams.get('search')){
      console.log(this.navParams.get('search'));
      this.getProductCategoryList(this.navParams.get('search'));
      this.subCatName  = this.navParams.get('search');
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
    
    this.flag='';
    refresher.complete();
  }
  
  goOnProductDetailPage(id){
    this.navCtrl.push(ProductDetailPage,{'id':id})
  }
  
  
  
  getProductCategoryList(search)
  {
    console.log(search);
    
    this.filter.limit = 0;
    this.filter.search=search;
    
    this.service.post_rqst({'filter' : this.filter},'app_master/getSubCategory')
    .subscribe((r)=>
    {
      console.log(r);
      this.service.onDismissLoadingHandler();
      this.sub_cat_list = r.sub_category;
      if(this.sub_cat_list.length == 0)
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

  
  goToMasterSearch(){
    this.navCtrl.push(MasterSearchPage)
  }
  
  
  
  
  checkSubCategory(item)
  {
    console.log(item);
    
    if(item.sub_category_count > 0){
      this.navCtrl.push(ParentSubCategoryPage,{'name':item.main_category, 'id':item.id})
    }
    else{
      this.navCtrl.push(ProductDetailPage,{'name':item.main_category,'id':item.id})
    }
    
    // this.filter.search=search;
    // this.filter.limit = 0;
    // this.filter.ii=id;
    // this.service.post_rqst({'filter' : this.filter},'app_master/getSubCategory')
    // .subscribe((r)=>
    // {
    //   console.log(r);
    
    // })
  }
  
  
  // getImages(category_id,index)
  // {
  //   this.service.post_rqst({'category_id' : category_id},'app_master/getSubCatImages').subscribe((res)=>
  //   {
  
  //     this.prod_cat_list[index]['image']=res['image'];
  //   })
  // }
  loadData(infiniteScroll)
  {
    console.log('loading');
    
    this.filter.limit=this.prod_cat_list.length;
    this.service.post_rqst({'filter' : this.filter},'app_master/categoryList')
    .subscribe( r =>
      {
        console.log(r);
        if(r['categories']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.prod_cat_list=this.prod_cat_list.concat(r['categories']);
            console.log(this.prod_cat_list.length +' '+ r['categories'].length)
            for (let index =(this.prod_cat_list.length - r['categories'].length); index < this.prod_cat_list.length; index++) {
              console.log(index)
              // this.getImages(this.prod_cat_list[index]['id'],index)
              
              
            }
            infiniteScroll.complete();
          },1000);
        }
      });
    }
   
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
  