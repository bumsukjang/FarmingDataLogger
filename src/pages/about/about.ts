import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	username: string;
	siteId: string;
	device: string;
	location: string;
	phone: string;
	ch1Name: string;
	ch1Unit: string;
	ch1High: number;
	ch1Low: number;
	ch2Name: string;
	ch2Unit: string;
	ch2High: number;
	ch2Low: number;
	tempHighLow: any;
	humiHighLow: any;
  constructor(private storage: Storage, public navCtrl: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController, ) {
	  this.username = auth.getUserInfo().getUsername();
	this.siteId = auth.getUserInfo().getSiteId();
	this.device = auth.getUserInfo().getDevice();
	this.location = auth.getUserInfo().getLocation();
	this.phone = auth.getUserInfo().getPhone();
	/*
	this.ch1High = auth.getUserInfo().getCh1High();
	this.ch1Low = auth.getUserInfo().getCh1Low();
	this.ch2High = auth.getUserInfo().getCh2High();
	this.ch2Low = auth.getUserInfo().getCh2Low();
	this.tempHighLow = {
		upper: this.ch1High,
		lower: this.ch1Low
	}
	this.humiHighLow = {
		upper: this.ch2High,
		lower: this.ch2Low
	}
	*/
	storage.get('ch1High').then((val) => {
		this.ch1High = val;
	});
	storage.get('ch1Low').then((val) => {
		this.ch1Low = val;
	});
	storage.get('ch2High').then((val) => {
		this.ch2High = val;
	});
	storage.get('ch2Low').then((val) => {
		this.ch2Low = val;
	});
  }
  
  reload(){
	this.username = this.auth.getUserInfo().getUsername();
	this.siteId = this.auth.getUserInfo().getSiteId();
	this.device = this.auth.getUserInfo().getDevice();
	this.location = this.auth.getUserInfo().getLocation();
	this.phone = this.auth.getUserInfo().getPhone();
	this.ch1High = this.auth.getUserInfo().getCh1High();
	this.ch1Low = this.auth.getUserInfo().getCh1Low();
	this.ch2High = this.auth.getUserInfo().getCh2High();
	this.ch2Low = this.auth.getUserInfo().getCh2Low();
	this.tempHighLow = {
		upper: this.ch1High,
		lower: this.ch1Low
	}
	this.humiHighLow = {
		upper: this.ch2High,
		lower: this.ch2Low
	}
  }
  saveSetting(){
	  this.storage.set('ch1High', this.ch1High);
	  this.storage.set('ch1Low', this.ch1Low);
	  this.storage.set('ch2High', this.ch2High);
	  this.storage.set('ch2Low', this.ch2Low);
	  this.showAlert("저장성공");
	  /*
	  this.auth.getUserInfo().setCh1High(this.ch1High);
	  console.log(this.ch1High);
	  this.auth.getUserInfo().setCh1Low(this.ch1Low);
	  console.log(this.ch1Low);
	  this.auth.getUserInfo().setCh2High(this.ch2High);
	  console.log(this.ch2High);
	  this.auth.getUserInfo().setCh2Low(this.ch2Low);
	  console.log(this.ch2Low);
	  console.log(this.auth.getUserInfo());
	  this.showAlert("저장성공");
	  */
  }
  
  showAlert(text) {
    let alert = this.alertCtrl.create({
      title: '계정정보 저장',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
