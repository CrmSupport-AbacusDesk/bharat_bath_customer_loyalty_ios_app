import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CancelComplaintPage } from './cancel-complaint';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    CancelComplaintPage,
  ],
  imports: [
    IonicPageModule.forChild(CancelComplaintPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class CancelComplaintPageModule {}
