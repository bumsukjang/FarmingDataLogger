//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
//import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

class SettingInfo{
	chNames: string[] = [];
	chUnits: string[] = [];
	chDisplay: boolean[] = [];
	
	ch1High: number;
	ch1Low: number;
	
	ch2High: number;
	ch2Low: number;
	
	constructor(chNames, chUnits, chDisplay, ch1High, ch1Low, ch2High, ch2Low){
		this.chNames = chNames;
		this.chUnits = chUnits;
		this.chDisplay = chDisplay;
		this.ch1High = ch1High;
		this.ch1Low = ch1Low;
		this.ch2High = ch2High;
		this.ch2Low = ch2Low;
	}
	
	setChNames(chNames){
		this.chNames = chNames;
	}
	
	getChNames(){
		return this.chNames;
	}
	
	setChUnits(chUnits){
		this.chUnits = chUnits;
	}
	
	getChUnits(){
		return this.chUnits;
	}
	
	setChDisplay(chDisplay){
		this.chDisplay = chDisplay;
	}
	
	getChDisplay(){
		return this.chDisplay;
	}
	
	setCh1High(ch1High){
		this.ch1High = ch1High;
	}
	
	getCh1High(){
		return this.ch1High;
	}
	
	setCh1Low(ch1Low){
		this.ch1Low = ch1Low;
	}
	
	getCh1Low(){
		return this.ch1Low;
	}
	
	setCh2High(ch2High){
		this.ch2High = ch2High;
	}
	
	getCh2High(){
		return this.ch2High;
	}
	
	setCh2Low(ch2Low){
		this.ch2Low = ch2Low;
	}	
	
	getCh2Low(){
		return this.ch2Low;
	}
}

@Injectable()
export class SettingServiceProvider {
	 setting: SettingInfo;
	 username;
	 
	 constructor(private storage: Storage) {
		console.log('Hello SettingInfo Provider');
		/*
		this.setting = new SettingInfo(
				["온도","습도","온도","습도","온도","습도","온도","습도"], 
				["℃","RH","℃","RH","℃","RH","℃","RH"], 
				[true,true,true,true,true,true,true,true],
				15,
				35,
				40,
				80);
				*/
	}

	  init(username){
		  this.username = username;
		  this.storage.get(username).then((val) => {
			  console.log("[SettingServiceProvider.ts init()-sval");
			  console.log(val);
			if(val == null){
				val = new SettingInfo(
				["온도(1)","습도(2)","온도(3)","습도(4)","온도(5)","습도(6)","온도(7)","습도(8)"], 
				["℃","RH","℃","RH","℃","RH","℃","RH"], 
				[true,true,true,true,true,true,true,true],
				35,
				15,
				80,
				40);
			}
			this.setting = val;
			console.log(this.setting);
		  });
		  //console.log(this.setting);
	  }
	  
	  get(){
		  return this.setting;
	  }
	  
	  save(chNames, chUnits, chDisplay, ch1High, ch1Low, ch2High, ch2Low){
		  /*
		  this.setting.setChNames(chNames);
		  this.setting.setChUnits(chUnits);
		  this.setting.setChDisplay(chDisplay);
		  this.setting.setCh1High(ch1High);
		  this.setting.setCh1Low(ch1Low);
		  this.setting.setCh2High(ch2High);
		  this.setting.setCh2Low(ch2Low);
		  */
		  this.setting.chNames = chNames;
		  this.setting.chUnits = chUnits;
		  this.setting.chDisplay = chDisplay;
		  this.setting.ch1High = ch1High;
		  this.setting.ch1Low = ch1Low;
		  this.setting.ch2High = ch2High;
		  this.setting.ch2Low = ch2Low;
		  console.log("setting save");
		  console.log(this.username);
		  console.log(this.setting);
		  this.storage.set(this.username,this.setting);
		  this.storage.get(this.username).then((val) =>{
			console.log("result");
		  
			console.log(val);		  
		  });
		  
	  }
	  
	  save_json(data){		  
		  console.log("save json");
		  console.log(this.username+"_json");
		  console.log(data);
		  this.storage.set(this.username+"_json",data);
		  console.log("result");
		  //console.log(this.storage.getJson(this.username+"_json"));
	  }
}
