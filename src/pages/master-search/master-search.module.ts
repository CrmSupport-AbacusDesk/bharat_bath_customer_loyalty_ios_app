import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MasterSearchPage } from './master-search';

@NgModule({
  declarations: [
    MasterSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(MasterSearchPage),
  ],
})
export class MasterSearchPageModule {}
