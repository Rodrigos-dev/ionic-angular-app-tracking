import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule} from '@angular/common/http'
import { BrMaskerModule } from 'br-mask';

import { File } from '@ionic-native/file/ngx'
import { AppVersion } from '@ionic-native/app-version/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx'


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,BrMaskerModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    File,AppVersion, HTTP,FileOpener,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
