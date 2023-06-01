import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RedeemHistoryDetailPage } from './redeem-history-detail';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    RedeemHistoryDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RedeemHistoryDetailPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class RedeemHistoryDetailPageModule {}
