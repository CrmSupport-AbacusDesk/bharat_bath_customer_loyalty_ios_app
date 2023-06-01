import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParentSubCategoryPage } from './parent-sub-category';

@NgModule({
  declarations: [
    ParentSubCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ParentSubCategoryPage),
  ],
})
export class ParentSubCategoryPageModule {}
