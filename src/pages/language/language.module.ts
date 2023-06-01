import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LanguagePage } from './language';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// @NgModule({
//   declarations: [
//     LanguagePage,
//   ],
//   imports: [
//     IonicPageModule.forChild(LanguagePage),
//   ],
// })

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    LanguagePage,
  ],
  imports: [
    IonicPageModule.forChild(LanguagePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class LanguagePageModule {}
