import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { SettingServiceProvider } from '../../providers/setting-service/setting-service';

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
	
	chNames: string[] = [];
	chUnits: string[] = [];
	chDisplay: boolean[] = [];
	
	ch1High: number;
	ch1Low: number;
	
	ch2High: number;
	ch2Low: number;
	
  constructor(private storage: Storage, 
			  public navCtrl: NavController, 
			  private auth: AuthServiceProvider, 
			  private alertCtrl: AlertController, 
			  private setting: SettingServiceProvider) {
	/*setting.init(auth.getUserInfo().getUsername());
	
	this.username = auth.getUserInfo().getUsername();
	this.siteId = auth.getUserInfo().getSiteId();
	this.device = auth.getUserInfo().getDevice();
	this.location = auth.getUserInfo().getLocation();
	this.phone = auth.getUserInfo().getPhone();
	setting.init(auth.getUserInfo().getUsername());
	
	console.log("settingInfo");
	console.log(this.setting.get());
	
	this.chNames = setting.get().chNames;
	this.chUnits = setting.get().chUnits;
	this.chDisplay = setting.get().chDisplay;
	this.ch1High = setting.get().ch1High;
	this.ch1Low = setting.get().ch1Low;
	this.ch2High = setting.get().ch2High;
	this.ch2Low = setting.get().ch2Low;
	*/
	
	/*
	this.chNames = setting.get().getChNames();
	this.chUnits = setting.get().getChUnits();
	this.chDisplay = setting.get().getChDisplay();
	this.ch1High = setting.get().getCh1High();
	this.ch1Low = setting.get().getCh1Low();
	this.ch2High = setting.get().getCh2High();
	this.ch2Low = setting.get().getCh2Low();
	*/
	/*
	storage.get(auth.getUserInfo()).then((val) => {
		setting.set(val);
	});
	*/
	
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
	
	
	storage.get('ch1High').then((val) => {
		this.settingInfo.ch1High = val;
	});
	storage.get('ch1Low').then((val) => {
		this.settingInfo.ch1Low = val;
	});
	storage.get('ch2High').then((val) => {
		this.settingInfo.ch2High = val;
	});
	storage.get('ch2Low').then((val) => {
		this.settingInfo.ch2Low = val;
	});
	*/
  }
  ionViewWillEnter(){
	  	console.log("[about.ts - ionViewDidLoad()]");
		console.log("[about.ts - ionViewDidLoad()] username : " + this.auth.getUserInfo().getUsername());
		this.setting.init(this.auth.getUserInfo().getUsername());
		
		console.log("[about.ts - ionViewDidLoad()] this.setting.get() : " + this.setting.get());		
	  if(this.setting.get() != null){
		  this.chNames = this.setting.get().chNames;
		this.chUnits = this.setting.get().chUnits;
		this.chDisplay = this.setting.get().chDisplay;
		this.ch1High = this.setting.get().ch1High;
		this.ch1Low = this.setting.get().ch1Low;
		this.ch2High = this.setting.get().ch2High;
		this.ch2Low = this.setting.get().ch2Low
	  }
  }
  
  ionViewDidLoad(){
	this.username = this.auth.getUserInfo().getUsername();
	this.siteId = this.auth.getUserInfo().getSiteId();
	this.device = this.auth.getUserInfo().getDevice();
	this.location = this.auth.getUserInfo().getLocation();
	this.phone = this.auth.getUserInfo().getPhone();
	
	console.log("[about.ts - ionViewDidLoad()]");
	console.log(this.setting.get());
	
	
	this.storage.get(this.username).then((val) => {
		if(val != null){
			this.chNames = val.chNames;
			this.chUnits = val.chUnits;
			this.chDisplay = val.chDisplay;
			this.ch1High = val.ch1High;
			this.ch1Low = val.ch1Low;
			this.ch2High = val.ch2High;
			this.ch2Low = val.ch2Low;	
		}
	});
	
	/*
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
	*/
  }
  saveSetting(){
	  //storage.set(auth.getUserInfo(), this.setting.getSettingInfo());
		/*
	  this.storage.set('ch1High', this.ch1High);
	  this.storage.set('ch1Low', this.ch1Low);
	  this.storage.set('ch2High', this.ch2High);
	  this.storage.set('ch2Low', this.ch2Low);
	  this.storage.set('chName', this.chName);
	  this.storage.set('chUnit', this.chUnit);
	  
		
	  this.storage.set('chNames', this.chNames);
	  this.storage.set('chUnits', this.chUnits);
	  this.storage.set('chDisplay', this.chDisplay);
	  */
		this.setting.save(this.chNames, 
		this.chUnits,
		this.chDisplay,
		this.ch1High,
		this.ch1Low,
		this.ch2High,
		this.ch2Low);
	
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
