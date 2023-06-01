import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewarrivalsPage } from '../newarrivals/newarrivals';

/**
 * Generated class for the HotsellingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hotselling',
  templateUrl: 'hotselling.html',
})
export class HotsellingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HotsellingPage');
  }

  goToNewArrivals(value)
  {
      
      this.navCtrl.push(NewarrivalsPage,value);

    
  }
}
