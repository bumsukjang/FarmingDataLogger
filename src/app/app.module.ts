import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
//import { ContactPage } from '../pages/contact/contact';
import { SensorPage } from '../pages/sensor/sensor';
import { TabsPage } from '../pages/tabs/tabs';

import { LoginPage } from '../pages/login/login';

import { HTTP } from '@ionic-native/http';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

import { BackgroundMode } from '@ionic-native/background-mode';

import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
//    ContactPage,
    SensorPage,
    TabsPage,
	LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
	IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
//    ContactPage,
    SensorPage,
    TabsPage,
	LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
	LocalNotifications,
	HTTP,
	BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider
  ]
})
export class AppModule {}
