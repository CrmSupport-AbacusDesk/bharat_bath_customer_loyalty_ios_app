import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, Loading,Nav } from 'ionic-angular';
import { CancelationPolicyPage } from '../cancelation-policy/cancelation-policy';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TabsPage } from '../tabs/tabs';
import { OfferListPage } from '../offer-list/offer-list';
import { EditProfilePage } from '../edit-profile/edit-profile';


@IonicPage()
@Component({
    selector: 'page-cancelpolicy-modal',
    templateUrl: 'cancelpolicy-modal.html', 
})
export class CancelpolicyModalPage {
    @ViewChild(Nav) nav: Nav;
    data:any={};
    otp_value:any='';
    karigar_id:any=''
    otp:any='';
    karigar_detail:any={};
    gift_id:any='';
    gift_detail:any='';
    redeemReqType:any ='';
    loading:Loading;
    mode:any = true;
    state_list:any=[];
    district_list:any=[];
    city_list:any=[];
    pincode_list:any=[];
    
    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public dbService:DbserviceProvider,
        public alertCtrl:AlertController,
        public loadingCtrl:LoadingController) { 
            
            this.getstatelist();
            this.data.check = false
            
        }
        
        
        
        ionViewDidLoad() {
            console.log('ionViewDidLoad CancelpolicyModalPage');
            
            this.redeemReqType = this.navParams.get('type');
            console.log(this.redeemReqType);
            this.karigar_id = this.navParams.get('karigar_id');
            
            console.log(this.karigar_id);
            this.gift_id = this.navParams.get('gift_id');
            console.log(this.gift_id);
            this.getOtpDetail();
            this.dbService.presentLoading();
            this.data.paytm_mobile = "";
            this.data.bank_account_number = "";
            this.data.bank_ifsc_code = "";
            this.data.bank_detail_type = "";
            this.data.bank_name = "";
        }
        
        
        dismiss() {
            let data = { 'foo': 'bar' };
            this.viewCtrl.dismiss(data);
        }
        
        
        getaddress(pincode)
        {
            if(this.data.pincode.length=='6')
            {
                this.dbService.post_rqst({'pincode':pincode},'app_karigar/getAddress')
                .subscribe( (result) =>
                {
                    console.log(result);
                    var address = result.data;
                    if(address!= null)
                    {
                        this.data.state = result.data.state_name;
                        this.data.area = result.data.area;
                        // this.data.address = result.data.address;
                        this.getDistrictList(this.data.state)
                        this.data.district = result.data.district_name;
                        this.data.city = result.data.city;
                        console.log(this.data);
                    }
                });
            }
            
        }
        
        
        getstatelist()
        {
            this.dbService.onGetRequestDataFromApi('app_karigar/getStates', this.dbService.rootUrl).subscribe( r =>
                {
                    console.log(r);
                    this.state_list=r['states'];
                    this.karigar_id=r['id'];
                    console.log(this.state_list);
                });
            }
            
            getDistrictList(state_name)
            {
                console.log(state_name);
                this.dbService.onPostRequestDataFromApi({'state_name':state_name},'app_master/getDistrict', this.dbService.rootUrl).subscribe( r =>
                    {
                        console.log(r);
                        this.district_list=r['districts'];
                        console.log(this.state_list);
                    });
                }
                
                
                goOnCancelationPolicy(){
                    this.navCtrl.push(CancelationPolicyPage)
                }
                
                getOtpDetail()
                {
                    console.log('otp');
                    this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id, 'mobile_no':this.dbService.userStorageData.mobile_no, 'gift_id':this.gift_id},'app_karigar/sendOtp', this.dbService.rootUrl)
                    .subscribe((r)=>
                    {
                        console.log(r);
                        this.dbService.onDismissLoadingHandler();
                        this.otp=r['otp'];
                        console.log(this.otp);
                        this.karigar_detail=r['karigar'];
                        this.gift_detail=r['gift'];
                        
                    });
                }
                resendOtp()
                {
                    this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'gift_id':this.gift_id},'app_karigar/sendOtp', this.dbService.rootUrl)
                    .subscribe((r)=>
                    {
                        
                        console.log(r);
                        this.otp=r['otp'];
                        console.log(this.otp);
                    });
                }
                
                otpvalidation()
                {
                    this.otp_value=false;
                    if(this.data.otp==this.otp)
                    {
                        this.otp_value=true
                    }
                }
                optionsFn(val){
                    console.log("val",val)   
                    console.log("paytm==>",this.data.redeemType)
                }
                
        
                
              
                submit()
                {
                    
                    // if(this.redeemReqType == 'Cash'){
                    //     if(!this.data.redeemType){
                    //         this.showAlert("Please Select Payment Method!");
                    //         return;
                            
                    //     }
                    //     else if(this.data.redeemType === 'bank'){
                    //         if(!this.karigar_detail.bank_name || !this.karigar_detail.account_no || !this.karigar_detail.ifsc_code || !this.karigar_detail.account_holder_name  ){
                    //             this.showAlert("Please Fill BanK Information!");
                    //             return;
                    //         }
                    //     }
                    //     else if(this.data.redeemType === 'paytm'){
                    //         if(!this.karigar_detail.paytm_mobile_number ){
                    //             this.showAlert("Please Fill Paytm Mobile Number!");
                    //             return;
                    //         } 
                    //     }
                    // }
                    
                    if(this.data.check == false){
                        this.showAlert("Please Accept Cancellations Policy");
                        return;  
                    }
                    
                    if(this.redeemReqType == 'Gift' && this.data.addressType == 'new' ){
                        this.data.shipping_address = this.data.address + ' ,'+this.data.city + ' ,'+this.data.district +' ,'+ this.data.state +' ,'+ this.data.pincode;
                    }

                    if(this.redeemReqType == 'Gift' && this.data.addressType == 'new' ){
                        this.data.shipping_address = this.data.address + ' ,'+this.data.city + ' ,'+this.data.district +' ,'+ this.data.state +' ,'+ this.data.pincode;
                    }

                    if(this.redeemReqType == 'Cash' && this.data.redeemType == 'bank' ){
                        this.karigar_detail.bank_name = this.data.bank_name;
                        this.karigar_detail.account_no = this.data.account_no; 
                        this.karigar_detail.ifsc_code =this.data.ifsc_code; 
                        this.karigar_detail.account_holder_name =this.data.account_holder_name;
                    }
                    
                    
                    this.dbService.presentLoading();
                    console.log('data');
                    console.log(this.data);
                    this.dbService.onPostRequestDataFromApi( {'karigar_id': this.dbService.userStorageData.id,mobile:this.karigar_detail.mobile_no, 'shipping_address':this.data.shipping_address, 'bank_detail_type':this.data.bank_detail_type,'payment_type':this.data.redeemType,'bank_account_number':this.karigar_detail.account_no,'bank_ifsc_code':this.karigar_detail.ifsc_code,'account_holder_name':this.karigar_detail.account_holder_name,'paytm_mobile':this.data.paytm_mobile,"gift_id": this.gift_id,'offer_id':this.gift_detail.offer_id,'bankDetails':'','bank_name':this.karigar_detail.bank_name },'app_karigar/redeemRequest', this.dbService.rootUrl)
                    .subscribe( (r) =>
                    {
                        this.dbService.onDismissLoadingHandler();
                        console.log(r);
                        if(r['status']=="SUCCESS")
                        {
                            this.navCtrl.setRoot(OfferListPage);
                            this.showSuccess("Redeemed Request Sent Successfully");
                        }
                        else if(r['status']=="EXIST")
                        {
                            this.showAlert(" Already Redeemed!");
                        }
                    });
                }
                
                
                showAlert(text) {
                    let alert = this.alertCtrl.create({
                        title:'Alert!',
                        cssClass:'action-close',
                        subTitle: text,
                        buttons: [{
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => {
                                console.log('Cancel clicked');
                            }
                        },
                        {
                            text:'OK',
                            cssClass: 'close-action-sheet',
                            handler:()=>{
                                // this.navCtrl.push(TransactionPage);
                            }
                        }]
                    });
                    alert.present();
                }
                showSuccess(text)
                {
                    let alert = this.alertCtrl.create({
                        title:'Success!',
                        cssClass:'action-close',
                        subTitle: text,
                        buttons: ['OK']
                    });
                    alert.present();
                }
                
                ionViewDidLeave()
                {
                    console.log('leave');
                    this.dismiss()
                }
                updateProfile(){
                    // this.navCtrl.push(EditProfilePage,{'data':this.karigar_detail})
                    this.navCtrl.push(EditProfilePage,{'detail':this.karigar_detail});
                }
                
                
                checkAddree(type)
                {
                    console.log(type);
                    if(type='same')
                    {
                        this.data.shipping_address=this.karigar_detail.address + ' ,'+this.karigar_detail.city + ' ,'+this.karigar_detail.district +' ,'+ this.karigar_detail.state +' ,'+ this.karigar_detail.pincode;
                    }
                    else{
                        this.data.shipping_address='';
                    }
                    
                    
                }
                myNumber()
                {
                    console.log(this.data);
                    if(this.data.check1==true)
                    {
                        this.data.paytm_mobile=this.karigar_detail.mobile_no;
                    }
                    else{
                        this.data.paytm_mobile='';
                    }
                    
                    
                }

                bankCheck()
                {
                    if(this.data.check2==true)
                    {
                        this.data.bank_name = this.karigar_detail.bank_name;
                        this.data.account_no = this.karigar_detail.account_no; 
                        this.data.ifsc_code =this.karigar_detail.ifsc_code; 
                        this.data.account_holder_name = this.karigar_detail.account_holder_name;
                    }
                    else{
                        this.data.bank_name = '';
                        this.data.account_no = '';
                        this.data.ifsc_code = ''; 
                        this.data.account_holder_name = '';
                    }
                    
                    
                }
                
            }
            