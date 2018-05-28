import { TabsPage } from './../tabs/tabs';
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
	chHighs: number[] = [];
	chLows: number[] = [];
	chRanges: any[] = [];
		
  constructor(private storage: Storage, 
			  public navCtrl: NavController, 
			  private auth: AuthServiceProvider, 
			  private alertCtrl: AlertController, 
			  private setting: SettingServiceProvider) {
	

	this.username = this.auth.getUserInfo().getUsername();
	this.siteId = this.auth.getUserInfo().getSiteId();
	this.device = this.auth.getUserInfo().getDevice();
	this.location = this.auth.getUserInfo().getLocation();
	this.phone = this.auth.getUserInfo().getPhone();
	
	console.log("[about.ts - ionViewDidLoad()]");
	console.log(this.setting.get());
	
	let settings = this.setting.get()
	this.storage.get(this.username).then((val) => {
		console.log(val);
		if(val != null){
			settings = val;
		}
	});

	if(settings != null){
		this.chNames = settings.chNames;
		this.chUnits = settings.chUnits;
		this.chDisplay = settings.chDisplay;
		this.chHighs = settings.chHighs;
		this.chLows = settings.chLows;
		this.chRanges = settings.chRanges;
		console.log("this.chRanges");
		console.log(this.chRanges);
	}

  }
  /* ionViewWillEnter(){
	  	console.log("[about.ts - ionViewDidLoad()]");
		console.log("[about.ts - ionViewDidLoad()] username : " + this.auth.getUserInfo().getUsername());
		this.setting.init(this.auth.getUserInfo().getUsername());
		
		console.log("[about.ts - ionViewDidLoad()] this.setting.get() : " + this.setting.get());		
	  if(this.setting.get() != null){
		  this.chNames = this.setting.get().chNames;
		this.chUnits = this.setting.get().chUnits;
		this.chDisplay = this.setting.get().chDisplay;
		this.chHighs = this.setting.get().chHighs;
		this.chLows = this.setting.get().chLows;
		for(let i = 0 ; i < this.chHighs.length; i++){
			this.chRanges[0] = {
				lower: this.chLows[i],
				upper: this.chHighs[i]
			};
		}
		console.log("this.chRanges");
		console.log(this.chRanges);
	  }
  } */
  ionViewWillEnter(){
	this.username = this.auth.getUserInfo().getUsername();
	this.siteId = this.auth.getUserInfo().getSiteId();
	this.device = this.auth.getUserInfo().getDevice();
	this.location = this.auth.getUserInfo().getLocation();
	this.phone = this.auth.getUserInfo().getPhone();
	
	console.log("[about.ts - ionViewDidLoad()]");
	console.log(this.setting.get());
	
	let settings = this.setting.get()
	this.storage.get(this.username).then((val) => {
		console.log(val);
		if(val != null){
			settings = val;
		}
	});

	if(settings != null){
		this.chNames = settings.chNames;
		this.chUnits = settings.chUnits;
		this.chDisplay = settings.chDisplay;
		this.chHighs = settings.chHighs;
		this.chLows = settings.chLows;
		this.chRanges = settings.chRanges;
		console.log("this.chRanges");
		console.log(this.chRanges);
	}
	
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
		this.chRanges);

		if(this.username =='admin'){
			this.auth.currentUser.siteID = this.siteId;
		}
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

  changeAccount(){
	this.auth.login({username:this.username}, { 'data' : '{"logFlag": true,"modified": true,"reqType": 1,"siteId": '+this.siteId+'}'}).subscribe(allowed => {
		if (allowed) {
			//AboutPage.reload();
			this.navCtrl.parent.viewCtrl._nav.setRoot(TabsPage);
		} else {
			console.log("change account error");
		}
	},
	error => {
		console.log("change account error");
	});	
  }
}
